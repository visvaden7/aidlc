package com.tableorder.controller;

import com.tableorder.dto.request.CreateOrderRequest;
import com.tableorder.dto.request.UpdateOrderStatusRequest;
import com.tableorder.dto.response.OrderResponse;
import com.tableorder.security.JwtAuthenticationFilter.JwtUserDetails;
import com.tableorder.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/tables/{tableId}/orders")
    public ResponseEntity<OrderResponse> createOrder(
            @PathVariable Long tableId,
            @Valid @RequestBody CreateOrderRequest request,
            Authentication auth) {
        Long storeId = ((JwtUserDetails) auth.getDetails()).storeId();
        return ResponseEntity.ok(orderService.createOrder(tableId, storeId, request));
    }

    @GetMapping("/api/tables/{tableId}/orders")
    public ResponseEntity<List<OrderResponse>> getSessionOrders(@PathVariable Long tableId) {
        return ResponseEntity.ok(orderService.getOrdersByCurrentSession(tableId));
    }

    @GetMapping("/api/admin/tables/{tableId}/orders")
    public ResponseEntity<List<OrderResponse>> getTableOrders(@PathVariable Long tableId) {
        return ResponseEntity.ok(orderService.getOrdersByTable(tableId));
    }

    @PutMapping("/api/admin/orders/{orderId}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(orderId, request.getStatus()));
    }

    @DeleteMapping("/api/admin/orders/{orderId}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long orderId) {
        orderService.deleteOrder(orderId);
        return ResponseEntity.ok().build();
    }
}
