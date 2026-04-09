package com.tableorder.service;

import com.tableorder.dto.request.CreateOrderRequest;
import com.tableorder.dto.response.OrderItemResponse;
import com.tableorder.dto.response.OrderResponse;
import com.tableorder.entity.*;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableSessionRepository tableSessionRepository;
    private final TableInfoRepository tableInfoRepository;
    private final MenuRepository menuRepository;
    private final SseService sseService;

    @Transactional
    public OrderResponse createOrder(Long tableId, Long storeId, CreateOrderRequest request) {
        TableInfo table = tableInfoRepository.findById(tableId)
                .orElseThrow(() -> BusinessException.notFound("테이블을 찾을 수 없습니다."));

        // Find or create active session
        TableSession session = tableSessionRepository.findByTableIdAndIsActive(tableId, true)
                .orElseGet(() -> tableSessionRepository.save(
                        TableSession.builder().tableId(tableId).storeId(storeId).build()
                ));

        // Build order items with snapshots
        List<OrderItem> items = new ArrayList<>();
        int totalAmount = 0;

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Menu menu = menuRepository.findById(itemReq.getMenuId())
                    .orElseThrow(() -> BusinessException.notFound("메뉴를 찾을 수 없습니다: " + itemReq.getMenuId()));

            if (!menu.getIsAvailable()) {
                throw BusinessException.badRequest("현재 주문할 수 없는 메뉴입니다: " + menu.getMenuName());
            }

            int subtotal = menu.getPrice() * itemReq.getQuantity();
            totalAmount += subtotal;

            items.add(OrderItem.builder()
                    .menuId(menu.getMenuId())
                    .menuName(menu.getMenuName())
                    .quantity(itemReq.getQuantity())
                    .unitPrice(menu.getPrice())
                    .subtotal(subtotal)
                    .build());
        }

        // Generate order number
        int orderCount = orderRepository.countBySessionId(session.getSessionId()) + 1;
        String orderNumber = String.format("T%d-%03d", table.getTableNumber(), orderCount);

        // Save order
        Order order = orderRepository.save(Order.builder()
                .sessionId(session.getSessionId())
                .storeId(storeId)
                .tableId(tableId)
                .orderNumber(orderNumber)
                .totalAmount(totalAmount)
                .build());

        // Save order items
        items.forEach(item -> item.setOrderId(order.getOrderId()));
        orderItemRepository.saveAll(items);

        List<OrderItemResponse> itemResponses = items.stream().map(OrderItemResponse::from).toList();
        OrderResponse response = OrderResponse.from(order, itemResponses, table.getTableNumber());

        // Publish SSE event
        sseService.publishEvent(storeId, "new-order", response);

        return response;
    }

    public List<OrderResponse> getOrdersByCurrentSession(Long tableId) {
        TableSession session = tableSessionRepository.findByTableIdAndIsActive(tableId, true)
                .orElse(null);
        if (session == null) return List.of();

        TableInfo table = tableInfoRepository.findById(tableId).orElse(null);
        Integer tableNumber = table != null ? table.getTableNumber() : 0;

        return orderRepository.findBySessionIdOrderByCreatedAtAsc(session.getSessionId()).stream()
                .map(order -> {
                    List<OrderItemResponse> items = orderItemRepository.findByOrderId(order.getOrderId())
                            .stream().map(OrderItemResponse::from).toList();
                    return OrderResponse.from(order, items, tableNumber);
                }).toList();
    }

    public List<OrderResponse> getOrdersByTable(Long tableId) {
        return getOrdersByCurrentSession(tableId);
    }

    @Transactional
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> BusinessException.notFound("주문을 찾을 수 없습니다."));

        if (!order.getStatus().canTransitionTo(newStatus)) {
            throw BusinessException.badRequest(
                    String.format("잘못된 상태 전이입니다: %s → %s", order.getStatus(), newStatus));
        }

        order.setStatus(newStatus);
        orderRepository.save(order);

        sseService.publishEvent(order.getStoreId(), "order-status-changed",
                Map.of("orderId", orderId, "tableId", order.getTableId(), "newStatus", newStatus));

        TableInfo table = tableInfoRepository.findById(order.getTableId()).orElse(null);
        Integer tableNumber = table != null ? table.getTableNumber() : 0;
        List<OrderItemResponse> items = orderItemRepository.findByOrderId(orderId)
                .stream().map(OrderItemResponse::from).toList();
        return OrderResponse.from(order, items, tableNumber);
    }

    @Transactional
    public void deleteOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> BusinessException.notFound("주문을 찾을 수 없습니다."));

        orderItemRepository.deleteByOrderId(orderId);
        orderRepository.delete(order);

        sseService.publishEvent(order.getStoreId(), "order-deleted",
                Map.of("orderId", orderId, "tableId", order.getTableId()));
    }
}
