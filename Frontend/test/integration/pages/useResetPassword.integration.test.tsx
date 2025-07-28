// test/integration/pages/useResetPassword.integration.test.tsx
import {
  vi,
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  type Mock,
} from 'vitest';

// ────────────────────────────────────────────────────────────
// Mock react-router-dom FIRST so every import sees the stub
// ────────────────────────────────────────────────────────────
const navigateSpy = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => navigateSpy,
  };
});

// ────────────────────────────────────────────────────────────
// Remaining imports (after the router mock)
// ────────────────────────────────────────────────────────────
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import useResetPassword from '../../../src/modules/public/ResetPassword/hooks/useResetPassword';

import authApi from '../../../src/services/axios/auth.api';     // <- SAME path as in the hook
import { toast } from 'sonner';

// ─── Mock axios POST + toast ─────────────────────────────────
vi.mock('../../../src/services/axios/auth.api', () => ({ default: { post: vi.fn() } }));
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

const apiPost = authApi.post as unknown as Mock;
const toastSuccess = toast.success as unknown as Mock;
const toastError = toast.error as unknown as Mock;

// ─── Test helpers ────────────────────────────────────────────
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
});

afterEach(() => {
  vi.useRealTimers();
});

const TOKEN = 'abc123';
const PASSWORD = 'NewPassword$1';

// ─── Tests ───────────────────────────────────────────────────
describe('useResetPassword (integration)', () => {
  it('submits successfully and redirects', async () => {
    apiPost.mockResolvedValueOnce({ status: 204 });

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.reset({ token: TOKEN, new_password: PASSWORD });
    });

    expect(apiPost).toHaveBeenCalledWith('/auth/reset-password', {
      token: TOKEN,
      new_password: PASSWORD,
    });

    expect(result.current.success).toBe(true);
    expect(toastSuccess).toHaveBeenCalledWith(
      'Password updated, you can now log in!'
    );

    vi.runAllTimers(); // flush setTimeout(…, 500)
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });

  it('handles API error and shows toast', async () => {
    apiPost.mockRejectedValueOnce({
      response: { data: { message: 'Token expired' } },
    });

    const { result } = renderHook(() => useResetPassword(), { wrapper });

    await act(async () => {
      await result.current.reset({ token: TOKEN, new_password: PASSWORD });
    });

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Token expired');
    expect(toastError).toHaveBeenCalledWith('Token expired');
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});
