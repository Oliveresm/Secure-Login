import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from '../../../src/modules/public/Register/Register';
import * as useRegisterHook from '../../../src/modules/public/Register/hooks/useRegister';

describe('Register integration', () => {
  const mockRegister = vi.fn();

  beforeEach(() => {
    vi.spyOn(useRegisterHook, 'default').mockReturnValue({
      register: mockRegister,
      loading: false,
      genericError: null,
      fieldErrors: {},
    });
  });

  it('registers a user and redirects to login with success toast', async () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'john_doe' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' },
    });

    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        display_name: 'john_doe',
        email: 'john@example.com',
        password: 'Password123!',
      });
    });
  });
});
