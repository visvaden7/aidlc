package com.tableorder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
@Slf4j
public class SseService {

    private static final long SSE_TIMEOUT = 30 * 60 * 1000L; // 30 minutes
    private final Map<Long, List<SseEmitter>> storeEmitters = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long storeId) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);
        List<SseEmitter> emitters = storeEmitters.computeIfAbsent(storeId, k -> new CopyOnWriteArrayList<>());
        emitters.add(emitter);

        emitter.onCompletion(() -> removeEmitter(storeId, emitter));
        emitter.onTimeout(() -> removeEmitter(storeId, emitter));
        emitter.onError(e -> removeEmitter(storeId, emitter));

        try {
            emitter.send(SseEmitter.event().name("connected").data("SSE connected"));
        } catch (IOException e) {
            removeEmitter(storeId, emitter);
        }

        return emitter;
    }

    public void publishEvent(Long storeId, String eventType, Object data) {
        List<SseEmitter> emitters = storeEmitters.get(storeId);
        if (emitters == null || emitters.isEmpty()) return;

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name(eventType).data(data));
            } catch (IOException e) {
                removeEmitter(storeId, emitter);
            }
        }
    }

    private void removeEmitter(Long storeId, SseEmitter emitter) {
        List<SseEmitter> emitters = storeEmitters.get(storeId);
        if (emitters != null) {
            emitters.remove(emitter);
        }
    }
}
