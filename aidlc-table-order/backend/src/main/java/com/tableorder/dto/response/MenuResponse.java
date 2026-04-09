package com.tableorder.dto.response;

import com.tableorder.entity.Menu;
import lombok.*;

@Getter @Setter @Builder @NoArgsConstructor @AllArgsConstructor
public class MenuResponse {
    private Long menuId;
    private String menuName;
    private Integer price;
    private String description;
    private String imageUrl;
    private Long categoryId;
    private Integer displayOrder;
    private Boolean isAvailable;

    public static MenuResponse from(Menu menu) {
        return MenuResponse.builder()
                .menuId(menu.getMenuId())
                .menuName(menu.getMenuName())
                .price(menu.getPrice())
                .description(menu.getDescription())
                .imageUrl(menu.getImageUrl())
                .categoryId(menu.getCategoryId())
                .displayOrder(menu.getDisplayOrder())
                .isAvailable(menu.getIsAvailable())
                .build();
    }
}
