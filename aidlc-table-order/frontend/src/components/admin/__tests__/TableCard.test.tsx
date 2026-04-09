import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TableCard from '../TableCard';

describe('TableCard', () => {
  const defaultProps = {
    tableId: 1,
    tableNumber: 1,
    totalAmount: 25000,
    activeSession: true,
    orderCount: 3,
    isHighlighted: false,
    onClick: vi.fn(),
  };

  it('renders active table with amount and order count', () => {
    render(<TableCard {...defaultProps} />);

    expect(screen.getByText('테이블 1')).toBeInTheDocument();
    expect(screen.getByText('25,000원')).toBeInTheDocument();
    expect(screen.getByText(/주문 3건/)).toBeInTheDocument();
  });

  it('renders inactive table with "대기중" text', () => {
    render(
      <TableCard
        {...defaultProps}
        activeSession={false}
        totalAmount={0}
        orderCount={0}
      />,
    );

    expect(screen.getByText('테이블 1')).toBeInTheDocument();
    expect(screen.getByText('대기중')).toBeInTheDocument();
  });

  it('calls onClick with tableId when clicked', () => {
    const onClick = vi.fn();
    render(<TableCard {...defaultProps} onClick={onClick} />);

    fireEvent.click(screen.getByTestId('table-card-1'));
    expect(onClick).toHaveBeenCalledWith(1);
  });

  it('applies pulse class when highlighted', () => {
    render(<TableCard {...defaultProps} isHighlighted={true} />);

    const card = screen.getByTestId('table-card-1');
    expect(card.className).toContain('table-card-pulse');
  });

  it('does not apply pulse class when not highlighted', () => {
    render(<TableCard {...defaultProps} isHighlighted={false} />);

    const card = screen.getByTestId('table-card-1');
    expect(card.className).not.toContain('table-card-pulse');
  });
});
