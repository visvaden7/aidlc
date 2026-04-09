import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import OrderStatusControl from '../OrderStatusControl';

describe('OrderStatusControl', () => {
  it('renders "준비중으로" button for WAITING status', () => {
    const onChange = vi.fn();
    render(<OrderStatusControl currentStatus="WAITING" onStatusChange={onChange} />);

    const button = screen.getByTestId('order-status-control-WAITING');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('준비중으로');
  });

  it('renders "완료로" button for PREPARING status', () => {
    const onChange = vi.fn();
    render(<OrderStatusControl currentStatus="PREPARING" onStatusChange={onChange} />);

    const button = screen.getByTestId('order-status-control-PREPARING');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('완료로');
  });

  it('renders nothing for COMPLETE status', () => {
    const onChange = vi.fn();
    const { container } = render(
      <OrderStatusControl currentStatus="COMPLETE" onStatusChange={onChange} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls onStatusChange with PREPARING when WAITING button clicked', () => {
    const onChange = vi.fn();
    render(<OrderStatusControl currentStatus="WAITING" onStatusChange={onChange} />);

    fireEvent.click(screen.getByTestId('order-status-control-WAITING'));
    expect(onChange).toHaveBeenCalledWith('PREPARING');
  });

  it('calls onStatusChange with COMPLETE when PREPARING button clicked', () => {
    const onChange = vi.fn();
    render(<OrderStatusControl currentStatus="PREPARING" onStatusChange={onChange} />);

    fireEvent.click(screen.getByTestId('order-status-control-PREPARING'));
    expect(onChange).toHaveBeenCalledWith('COMPLETE');
  });
});
