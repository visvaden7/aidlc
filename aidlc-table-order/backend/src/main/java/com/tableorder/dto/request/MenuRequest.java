package com.tableorder.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class MenuRequest {
    @NotBlank private String menuName;
    @NotNull @Min(0) @Max(1000000) private Integer price;
    private String description;
    @NotNull private Long categoryId;
    private String imageUrl;
}
