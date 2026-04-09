package com.tableorder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_session", indexes = @Index(columnList = "tableId,isActive"))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TableSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    @Column(nullable = false)
    private Long tableId;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private LocalDateTime startedAt;

    private LocalDateTime endedAt;

    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @PrePersist
    protected void onCreate() {
        this.startedAt = LocalDateTime.now();
    }
}
