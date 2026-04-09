package com.tableorder.dto.response;

import lombok.*;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TableDetailResponse {
    private Long tableId;
    private Integer tableNumber;
    private Integer totalAmount;
    private Boolean activeSession;
    private List<OrderResponse> orders;
}
