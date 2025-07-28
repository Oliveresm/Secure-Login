// test/integration/pages/verify-account.integration.test.tsx
import { describe, it, beforeEach, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import '@testing-library/jest-dom';

// Mocks ----------------------------------------------------
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<object>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

import VerifyAccount from '../../../src/modules/public/VerifyAccount/VerifyAccount';
import secureApi from '../../../src/services/axios/secure.api';
import { toast } from 'sonner';

vi.mock('../../../src/services/axios/secure.api', () => ({
  __esModule: true,
  default: { get: vi.fn() },
}));
vi.mock('sonner', () => ({
  __esModule: true,
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

//  Helpers --------------------------------------------------
const renderWithRoute = (initialPath: string) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/verify" element={<VerifyAccount />} />
        {/* dummy route so useNavigate('/login') is valid */}
        <Route path="/login" element={<div>Login</div>} />
      </Routes>
    </MemoryRouter>
  );

//  Tests ----------------------------------------------------
describe('VerifyAccount integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the API, shows success toast and redirects when the token is present', async () => {
    // Arrange
    (secureApi.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce({ status: 200 });

    renderWithRoute('/verify?token=test-token');

    // Assert loading text appears first
    expect(screen.getByText(/verifying your account…/i)).toBeInTheDocument();

    // Wait for async effect to finish
    await waitFor(() => {
      expect(secureApi.get).toHaveBeenCalledWith('/auth/verify?token=test-token');
      expect(toast.success).toHaveBeenCalledWith('Your account has been verified!');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('shows an error toast and redirects immediately when no token is provided', async () => {
    renderWithRoute('/verify'); // no ?token=

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Missing verification token');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    // secureApi.get should never have been called
    expect(secureApi.get).not.toHaveBeenCalled();
  });
});
