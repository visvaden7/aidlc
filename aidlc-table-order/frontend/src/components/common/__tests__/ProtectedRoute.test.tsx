import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';
import { useAuthStore } from '@/stores/authStore';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    useAuthStore.setState({
      token: null,
      storeId: null,
      tableId: null,
      tableNumber: null,
      storeName: null,
      storeCode: null,
      role: null,
      isAuthenticated: false,
    });
  });

  it('renders children when authenticated with correct role', () => {
    useAuthStore.setState({
      token: 'test-token',
      storeId: 1,
      tableId: 1,
      role: 'TABLE',
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="TABLE">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.getByTestId('protected-content')).toBeInTheDocument();
  });

  it('redirects when not authenticated', () => {
    render(
      <MemoryRouter initialEntries={['/menu']}>
        <ProtectedRoute requiredRole="TABLE">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });

  it('redirects when role does not match', () => {
    useAuthStore.setState({
      token: 'test-token',
      storeId: 1,
      role: 'ADMIN',
      isAuthenticated: true,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requiredRole="TABLE">
          <div data-testid="protected-content">Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>,
    );

    expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
  });
});
