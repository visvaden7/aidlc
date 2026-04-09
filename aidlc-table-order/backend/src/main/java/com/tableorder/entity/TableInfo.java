package com.tableorder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "table_info", uniqueConstraints = @UniqueConstraint(columnNames = {"storeId", "tableNumber"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class TableInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tableId;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Integer tableNumber;

    @Column(nullable = false, length = 255)
    private String tablePassword;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
