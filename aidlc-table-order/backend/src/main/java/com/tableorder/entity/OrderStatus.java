package com.tableorder.entity;

public enum OrderStatus {
    WAITING,
    PREPARING,
    COMPLETE;

    public boolean canTransitionTo(OrderStatus next) {
        return switch (this) {
            case WAITING -> next == PREPARING;
            case PREPARING -> next == COMPLETE;
            case COMPLETE -> false;
        };
    }
}
