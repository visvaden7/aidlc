package com.tableorder.controller;

import com.tableorder.dto.response.OrderHistoryResponse;
import com.tableorder.dto.response.TableDetailResponse;
import com.tableorder.dto.response.TableSummaryResponse;
import com.tableorder.security.JwtAuthenticationFilter.JwtUserDetails;
import com.tableorder.service.TableService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/tables")
@RequiredArgsConstructor
public class TableController {

    private final TableService tableService;

    @GetMapping
    public ResponseEntity<List<TableSummaryResponse>> getAllTables(Authentication auth) {
        Long storeId = ((JwtUserDetails) auth.getDetails()).storeId();
        return ResponseEntity.ok(tableService.getAllTablesWithSummary(storeId));
    }

    @GetMapping("/{tableId}")
    public ResponseEntity<TableDetailResponse> getTableDetail(@PathVariable Long tableId) {
        return ResponseEntity.ok(tableService.getTableDetail(tableId));
    }

    @PostMapping("/{tableId}/complete")
    public ResponseEntity<Void> completeTableSession(
            @PathVariable Long tableId, Authentication auth) {
        Long storeId = ((JwtUserDetails) auth.getDetails()).storeId();
        tableService.completeTableSession(tableId, storeId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{tableId}/history")
    public ResponseEntity<List<OrderHistoryResponse>> getTableHistory(
            @PathVariable Long tableId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(tableService.getTableHistory(tableId, startDate, endDate));
    }
}
