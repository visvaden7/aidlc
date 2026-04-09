package com.tableorder.service;

import com.tableorder.dto.response.*;
import com.tableorder.entity.Order;
import com.tableorder.entity.TableInfo;
import com.tableorder.entity.TableSession;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TableService {

    private final TableInfoRepository tableInfoRepository;
    private final TableSessionRepository tableSessionRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final SseService sseService;

    public List<TableSummaryResponse> getAllTablesWithSummary(Long storeId) {
        List<TableInfo> tables = tableInfoRepository.findByStoreIdOrderByTableNumber(storeId);
        List<TableSummaryResponse> summaries = new ArrayList<>();

        for (TableInfo table : tables) {
            TableSession session = tableSessionRepository
                    .findByTableIdAndIsActive(table.getTableId(), true).orElse(null);

            int totalAmount = 0;
            int orderCount = 0;
            List<OrderResponse> recentOrders = List.of();
            boolean activeSession = session != null;

            if (session != null) {
                List<Order> orders = orderRepository.findBySessionIdOrderByCreatedAtAsc(session.getSessionId());
                totalAmount = orders.stream().mapToInt(Order::getTotalAmount).sum();
                orderCount = orders.size();

                int skip = Math.max(0, orders.size() - 3);
                recentOrders = orders.stream().skip(skip).map(order -> {
                    var items = orderItemRepository.findByOrderId(order.getOrderId())
                            .stream().map(OrderItemResponse::from).toList();
                    return OrderResponse.from(order, items, table.getTableNumber());
                }).toList();
            }

            summaries.add(TableSummaryResponse.builder()
                    .tableId(table.getTableId())
                    .tableNumber(table.getTableNumber())
                    .totalAmount(totalAmount)
                    .activeSession(activeSession)
                    .orderCount(orderCount)
                    .recentOrders(recentOrders)
                    .build());
        }
        return summaries;
    }

    public TableDetailResponse getTableDetail(Long tableId) {
        TableInfo table = tableInfoRepository.findById(tableId)
                .orElseThrow(() -> BusinessException.notFound("테이블을 찾을 수 없습니다."));

        TableSession session = tableSessionRepository
                .findByTableIdAndIsActive(tableId, true).orElse(null);

        int totalAmount = 0;
        List<OrderResponse> orders = List.of();
        boolean activeSession = session != null;

        if (session != null) {
            List<Order> orderList = orderRepository.findBySessionIdOrderByCreatedAtAsc(session.getSessionId());
            totalAmount = orderList.stream().mapToInt(Order::getTotalAmount).sum();
            orders = orderList.stream().map(order -> {
                var items = orderItemRepository.findByOrderId(order.getOrderId())
                        .stream().map(OrderItemResponse::from).toList();
                return OrderResponse.from(order, items, table.getTableNumber());
            }).toList();
        }

        return TableDetailResponse.builder()
                .tableId(table.getTableId())
                .tableNumber(table.getTableNumber())
                .totalAmount(totalAmount)
                .activeSession(activeSession)
                .orders(orders)
                .build();
    }

    @Transactional
    public void completeTableSession(Long tableId, Long storeId) {
        TableSession session = tableSessionRepository.findByTableIdAndIsActive(tableId, true)
                .orElseThrow(() -> BusinessException.badRequest("활성 세션이 없습니다."));

        session.setIsActive(false);
        session.setEndedAt(LocalDateTime.now());
        tableSessionRepository.save(session);

        sseService.publishEvent(storeId, "table-session-completed",
                Map.of("tableId", tableId, "sessionId", session.getSessionId()));
    }

    public List<OrderHistoryResponse> getTableHistory(Long tableId, LocalDate startDate, LocalDate endDate) {
        List<TableSession> sessions;

        if (startDate != null && endDate != null) {
            LocalDateTime start = startDate.atStartOfDay();
            LocalDateTime end = endDate.atTime(LocalTime.MAX);
            sessions = tableSessionRepository
                    .findByTableIdAndIsActiveFalseAndEndedAtBetweenOrderByEndedAtDesc(tableId, start, end);
        } else {
            sessions = tableSessionRepository.findByTableIdAndIsActiveFalseOrderByEndedAtDesc(tableId);
        }

        TableInfo table = tableInfoRepository.findById(tableId).orElse(null);
        Integer tableNumber = table != null ? table.getTableNumber() : 0;

        return sessions.stream().map(session -> {
            List<Order> orders = orderRepository.findBySessionIdOrderByCreatedAtAsc(session.getSessionId());
            int sessionTotal = orders.stream().mapToInt(Order::getTotalAmount).sum();

            List<OrderResponse> orderResponses = orders.stream().map(order -> {
                var items = orderItemRepository.findByOrderId(order.getOrderId())
                        .stream().map(OrderItemResponse::from).toList();
                return OrderResponse.from(order, items, tableNumber);
            }).toList();

            return OrderHistoryResponse.builder()
                    .sessionId(session.getSessionId())
                    .startedAt(session.getStartedAt())
                    .endedAt(session.getEndedAt())
                    .sessionTotal(sessionTotal)
                    .orders(orderResponses)
                    .build();
        }).toList();
    }
}
