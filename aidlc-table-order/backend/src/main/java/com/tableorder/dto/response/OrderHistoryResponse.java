package com.tableorder.dto.response;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class OrderHistoryResponse {
    private Long sessionId;
    private LocalDateTime startedAt;
    private LocalDateTime endedAt;
    private Integer sessionTotal;
    private List<OrderResponse> orders;
}
