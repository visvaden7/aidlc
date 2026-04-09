package com.tableorder.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "orders", indexes = {
    @Index(columnList = "sessionId"),
    @Index(columnList = "tableId,createdAt")
})
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    @Column(nullable = false)
    private Long sessionId;

    @Column(nullable = false)
    private Long storeId;

    @Column(nullable = false)
    private Long tableId;

    @Column(nullable = false, length = 20)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private OrderStatus status = OrderStatus.WAITING;

    @Column(nullable = false)
    private Integer totalAmount;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
