package com.tableorder.dto.response;

import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class TableLoginResponse {
    private String token;
    private Long storeId;
    private Long tableId;
    private Long sessionId;
    private String storeName;
}
