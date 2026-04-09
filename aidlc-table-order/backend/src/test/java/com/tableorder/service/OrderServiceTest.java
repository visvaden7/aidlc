package com.tableorder.service;

import com.tableorder.dto.request.CreateOrderRequest;
import com.tableorder.dto.response.OrderResponse;
import com.tableorder.entity.*;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private TableSessionRepository tableSessionRepository;
    @Mock private TableInfoRepository tableInfoRepository;
    @Mock private MenuRepository menuRepository;
    @Mock private SseService sseService;

    @InjectMocks private OrderService orderService;

    private TableInfo table;
    private TableSession session;
    private Menu menu;

    @BeforeEach
    void setUp() {
        table = TableInfo.builder().tableId(1L).storeId(1L).tableNumber(1).build();
        session = TableSession.builder().sessionId(1L).tableId(1L).storeId(1L).isActive(true).build();
        menu = Menu.builder().menuId(1L).menuName("김치찌개").price(9000).isAvailable(true).build();
    }

    @Test
    void createOrder_success() {
        CreateOrderRequest.OrderItemRequest itemReq = new CreateOrderRequest.OrderItemRequest();
        itemReq.setMenuId(1L);
        itemReq.setQuantity(2);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setItems(List.of(itemReq));

        when(tableInfoRepository.findById(1L)).thenReturn(Optional.of(table));
        when(tableSessionRepository.findByTableIdAndIsActive(1L, true)).thenReturn(Optional.of(session));
        when(menuRepository.findById(1L)).thenReturn(Optional.of(menu));
        when(orderRepository.countBySessionId(1L)).thenReturn(0);
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> {
            Order o = inv.getArgument(0);
            o.setOrderId(1L);
            return o;
        });
        when(orderItemRepository.saveAll(anyList())).thenAnswer(inv -> inv.getArgument(0));

        OrderResponse response = orderService.createOrder(1L, 1L, request);

        assertThat(response.getOrderNumber()).isEqualTo("T1-001");
        assertThat(response.getTotalAmount()).isEqualTo(18000);
        verify(sseService).publishEvent(eq(1L), eq("new-order"), any());
    }

    @Test
    void createOrder_unavailableMenu_throwsException() {
        menu.setIsAvailable(false);

        CreateOrderRequest.OrderItemRequest itemReq = new CreateOrderRequest.OrderItemRequest();
        itemReq.setMenuId(1L);
        itemReq.setQuantity(1);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setItems(List.of(itemReq));

        when(tableInfoRepository.findById(1L)).thenReturn(Optional.of(table));
        when(tableSessionRepository.findByTableIdAndIsActive(1L, true)).thenReturn(Optional.of(session));
        when(menuRepository.findById(1L)).thenReturn(Optional.of(menu));

        assertThatThrownBy(() -> orderService.createOrder(1L, 1L, request))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("주문할 수 없는 메뉴");
    }

    @Test
    void updateOrderStatus_validTransition() {
        Order order = Order.builder().orderId(1L).storeId(1L).tableId(1L).status(OrderStatus.WAITING).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenReturn(order);
        when(tableInfoRepository.findById(1L)).thenReturn(Optional.of(table));
        when(orderItemRepository.findByOrderId(1L)).thenReturn(List.of());

        OrderResponse response = orderService.updateOrderStatus(1L, OrderStatus.PREPARING);

        assertThat(response.getStatus()).isEqualTo(OrderStatus.PREPARING);
        verify(sseService).publishEvent(eq(1L), eq("order-status-changed"), any());
    }

    @Test
    void updateOrderStatus_invalidTransition_throwsException() {
        Order order = Order.builder().orderId(1L).status(OrderStatus.COMPLETE).build();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        assertThatThrownBy(() -> orderService.updateOrderStatus(1L, OrderStatus.WAITING))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("잘못된 상태 전이");
    }
}
