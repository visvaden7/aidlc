package com.tableorder.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class TableLoginRequest {
    @NotBlank private String storeCode;
    @NotNull private Integer tableNumber;
    @NotBlank private String password;
}
