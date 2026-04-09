package com.tableorder.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MenuOrderRequest {
    private Long menuId;
    private Integer displayOrder;
}
