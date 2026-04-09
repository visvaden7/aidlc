package com.tableorder.controller;

import com.tableorder.security.JwtTokenProvider;
import com.tableorder.service.SseService;
import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/admin/sse")
@RequiredArgsConstructor
public class SseController {

    private final SseService sseService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping(value = "/orders", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter subscribe(@RequestParam String token) {
        Claims claims = jwtTokenProvider.validateToken(token);
        Long storeId = jwtTokenProvider.getStoreId(claims);
        return sseService.subscribe(storeId);
    }
}
