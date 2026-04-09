package com.tableorder.dto.response;

import com.tableorder.entity.Order;
import com.tableorder.entity.OrderStatus;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderResponse {
    private Long orderId;
    private String orderNumber;
    private OrderStatus status;
    private Integer totalAmount;
    private Long tableId;
    private Integer tableNumber;
    private List<OrderItemResponse> items;
    private LocalDateTime createdAt;

    public static OrderResponse from(Order order, List<OrderItemResponse> items, Integer tableNumber) {
        return OrderResponse.builder()
                .orderId(order.getOrderId())
                .orderNumber(order.getOrderNumber())
                .status(order.getStatus())
                .totalAmount(order.getTotalAmount())
                .tableId(order.getTableId())
                .tableNumber(tableNumber)
                .items(items)
                .createdAt(order.getCreatedAt())
                .build();
    }
}
