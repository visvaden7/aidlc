package com.tableorder.controller;

import com.tableorder.dto.request.MenuOrderRequest;
import com.tableorder.dto.request.MenuRequest;
import com.tableorder.dto.response.CategoryResponse;
import com.tableorder.dto.response.MenuResponse;
import com.tableorder.security.JwtAuthenticationFilter.JwtUserDetails;
import com.tableorder.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    @GetMapping("/api/stores/{storeId}/menus")
    public ResponseEntity<List<MenuResponse>> getMenus(
            @PathVariable Long storeId,
            @RequestParam(required = false) Long categoryId) {
        if (categoryId != null) {
            return ResponseEntity.ok(menuService.getMenusByCategory(storeId, categoryId));
        }
        return ResponseEntity.ok(menuService.getMenusByStore(storeId));
    }

    @GetMapping("/api/stores/{storeId}/categories")
    public ResponseEntity<List<CategoryResponse>> getCategories(@PathVariable Long storeId) {
        return ResponseEntity.ok(menuService.getCategories(storeId));
    }

    @PostMapping("/api/admin/menus")
    public ResponseEntity<MenuResponse> createMenu(
            @Valid @RequestBody MenuRequest request, Authentication auth) {
        Long storeId = ((JwtUserDetails) auth.getDetails()).storeId();
        return ResponseEntity.ok(menuService.createMenu(storeId, request));
    }

    @PutMapping("/api/admin/menus/{menuId}")
    public ResponseEntity<MenuResponse> updateMenu(
            @PathVariable Long menuId, @Valid @RequestBody MenuRequest request) {
        return ResponseEntity.ok(menuService.updateMenu(menuId, request));
    }

    @DeleteMapping("/api/admin/menus/{menuId}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long menuId) {
        menuService.deleteMenu(menuId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/admin/menus/reorder")
    public ResponseEntity<Void> reorderMenus(@RequestBody List<MenuOrderRequest> orderList) {
        menuService.updateMenuOrder(orderList);
        return ResponseEntity.ok().build();
    }
}
