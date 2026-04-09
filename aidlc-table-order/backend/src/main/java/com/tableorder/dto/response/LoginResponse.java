package com.tableorder.dto.response;

import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long storeId;
    private Long expiresIn;
}
