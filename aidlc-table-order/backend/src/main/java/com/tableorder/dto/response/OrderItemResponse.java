package com.tableorder.dto.response;

import com.tableorder.entity.OrderItem;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderItemResponse {
    private Long orderItemId;
    private String menuName;
    private Integer quantity;
    private Integer unitPrice;
    private Integer subtotal;

    public static OrderItemResponse from(OrderItem item) {
        return OrderItemResponse.builder()
                .orderItemId(item.getOrderItemId())
                .menuName(item.getMenuName())
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .build();
    }
}
