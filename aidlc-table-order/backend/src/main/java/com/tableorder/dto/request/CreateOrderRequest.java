package com.tableorder.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter @Setter
public class CreateOrderRequest {

    @NotEmpty
    private List<OrderItemRequest> items;

    @Getter @Setter
    public static class OrderItemRequest {
        private Long menuId;
        private Integer quantity;
    }
}
