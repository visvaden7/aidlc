package com.tableorder.service;

import com.tableorder.dto.request.MenuOrderRequest;
import com.tableorder.dto.request.MenuRequest;
import com.tableorder.dto.response.CategoryResponse;
import com.tableorder.dto.response.MenuResponse;
import com.tableorder.entity.Menu;
import com.tableorder.exception.BusinessException;
import com.tableorder.repository.CategoryRepository;
import com.tableorder.repository.MenuRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MenuService {

    private final MenuRepository menuRepository;
    private final CategoryRepository categoryRepository;

    public List<MenuResponse> getMenusByStore(Long storeId) {
        return menuRepository.findByStoreIdOrderByDisplayOrder(storeId).stream()
                .map(MenuResponse::from).toList();
    }

    public List<MenuResponse> getMenusByCategory(Long storeId, Long categoryId) {
        return menuRepository.findByStoreIdAndCategoryIdOrderByDisplayOrder(storeId, categoryId).stream()
                .map(MenuResponse::from).toList();
    }

    public List<CategoryResponse> getCategories(Long storeId) {
        return categoryRepository.findByStoreIdOrderByDisplayOrder(storeId).stream()
                .map(CategoryResponse::from).toList();
    }

    @Transactional
    public MenuResponse createMenu(Long storeId, MenuRequest request) {
        categoryRepository.findById(request.getCategoryId())
                .filter(c -> c.getStoreId().equals(storeId))
                .orElseThrow(() -> BusinessException.badRequest("유효하지 않은 카테고리입니다."));

        int nextOrder = menuRepository.countByCategoryId(request.getCategoryId()) + 1;

        Menu menu = Menu.builder()
                .storeId(storeId)
                .categoryId(request.getCategoryId())
                .menuName(request.getMenuName())
                .price(request.getPrice())
                .description(request.getDescription())
                .imageUrl(request.getImageUrl())
                .displayOrder(nextOrder)
                .build();

        return MenuResponse.from(menuRepository.save(menu));
    }

    @Transactional
    public MenuResponse updateMenu(Long menuId, MenuRequest request) {
        Menu menu = menuRepository.findById(menuId)
                .orElseThrow(() -> BusinessException.notFound("메뉴를 찾을 수 없습니다."));

        menu.setMenuName(request.getMenuName());
        menu.setPrice(request.getPrice());
        menu.setDescription(request.getDescription());
        menu.setCategoryId(request.getCategoryId());
        menu.setImageUrl(request.getImageUrl());

        return MenuResponse.from(menuRepository.save(menu));
    }

    @Transactional
    public void deleteMenu(Long menuId) {
        if (!menuRepository.existsById(menuId)) {
            throw BusinessException.notFound("메뉴를 찾을 수 없습니다.");
        }
        menuRepository.deleteById(menuId);
    }

    @Transactional
    public void updateMenuOrder(List<MenuOrderRequest> orderList) {
        for (MenuOrderRequest item : orderList) {
            Menu menu = menuRepository.findById(item.getMenuId())
                    .orElseThrow(() -> BusinessException.notFound("메뉴를 찾을 수 없습니다: " + item.getMenuId()));
            menu.setDisplayOrder(item.getDisplayOrder());
            menuRepository.save(menu);
        }
    }
}
