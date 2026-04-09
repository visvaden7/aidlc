import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import OrderStatusBadge from '../OrderStatusBadge';

describe('OrderStatusBadge', () => {
  it('renders WAITING status as 대기중', () => {
    render(<OrderStatusBadge status="WAITING" />);
    expect(screen.getByText('대기중')).toBeInTheDocument();
  });

  it('renders PREPARING status as 준비중', () => {
    render(<OrderStatusBadge status="PREPARING" />);
    expect(screen.getByText('준비중')).toBeInTheDocument();
  });

  it('renders COMPLETE status as 완료', () => {
    render(<OrderStatusBadge status="COMPLETE" />);
    expect(screen.getByText('완료')).toBeInTheDocument();
  });

  it('has correct test id for each status', () => {
    const { rerender } = render(<OrderStatusBadge status="WAITING" />);
    expect(screen.getByTestId('order-status-badge-WAITING')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="PREPARING" />);
    expect(screen.getByTestId('order-status-badge-PREPARING')).toBeInTheDocument();

    rerender(<OrderStatusBadge status="COMPLETE" />);
    expect(screen.getByTestId('order-status-badge-COMPLETE')).toBeInTheDocument();
  });
});
