package com.tableorder.dto.request;

import com.tableorder.entity.OrderStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class UpdateOrderStatusRequest {
    @NotNull private OrderStatus status;
}
