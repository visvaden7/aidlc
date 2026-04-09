package com.tableorder.dto.response;

import lombok.*;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TableSummaryResponse {
    private Long tableId;
    private Integer tableNumber;
    private Integer totalAmount;
    private Boolean activeSession;
    private Integer orderCount;
    private List<OrderResponse> recentOrders;
}
