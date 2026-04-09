package com.tableorder.dto.response;

import com.tableorder.entity.Category;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class CategoryResponse {
    private Long categoryId;
    private String categoryName;
    private Integer displayOrder;

    public static CategoryResponse from(Category category) {
        return CategoryResponse.builder()
                .categoryId(category.getCategoryId())
                .categoryName(category.getCategoryName())
                .displayOrder(category.getDisplayOrder())
                .build();
    }
}
