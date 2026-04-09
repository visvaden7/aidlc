package com.tableorder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "admin_user", uniqueConstraints = @UniqueConstraint(columnNames = {"storeId", "username"}))
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class AdminUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long adminUserId;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false, length = 50)
    private String username;

    @Column(nullable = false, length = 255)
    private String passwordHash;

    @Column(nullable = false)
    @Builder.Default
    private Integer loginAttempts = 0;

    private LocalDateTime lockedUntil;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public boolean isLocked() {
        return lockedUntil != null && LocalDateTime.now().isBefore(lockedUntil);
    }
}
