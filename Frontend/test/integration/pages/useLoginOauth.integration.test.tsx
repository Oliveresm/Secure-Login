/**
 * test/integration/pages/useLoginOauth.integration.test.ts
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, beforeEach, expect, vi, type Mock } from 'vitest';

/* ─── fake timers ─────────────────────────────────────────────────────────── */
vi.useFakeTimers();

/* ─── firebase/auth mocks ─────────────────────────────────────────────────── */
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithPopup: vi.fn(),
  GoogleAuthProvider: vi.fn(),
}));
import { signInWithPopup } from 'firebase/auth';
const popUpMock = signInWithPopup as unknown as Mock;

/* ─── axios auth.api mock ─────────────────────────────────────────────────── */
vi.mock('../../../src/services/axios/auth.api', () => ({
  default: { post: vi.fn() },
}));
import authApi from '../../../src/services/axios/auth.api';
const axiosPostMock = authApi.post as unknown as Mock;

/* ─── sonner (toast) mock ─────────────────────────────────────────────────── */
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));
import { toast } from 'sonner';
const toastSuccessMock = toast.success as unknown as Mock;
const toastErrorMock   = toast.error   as unknown as Mock;

/* ─── react-router-dom (navigate) mock ────────────────────────────────────── */
const navigateMock = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

/* ─── hook under test (import after mocks) ────────────────────────────────── */
import useLoginOauth from '../../../src/modules/public/Login/hooks/useLoginOauth';

/* ─── user stub ───────────────────────────────────────────────────────────── */
const user = { getIdToken: vi.fn().mockResolvedValue('id-token') };

beforeEach(() => {
  vi.clearAllMocks();
});

/* ───────────────────────── tests ─────────────────────────────────────────── */
describe('useLoginOauth (integration)', () => {
  it('successful login redirects to /dashboard', async () => {
    popUpMock.mockResolvedValue({ user });
    axiosPostMock.mockResolvedValueOnce({ data: { accessToken: 'fake-access' } });

    const { result } = renderHook(() => useLoginOauth());
    await act(async () => result.current.loginWithGoogle());

    expect(axiosPostMock).toHaveBeenCalledWith('/auth/login/oauth', { idToken: 'id-token' });
    expect(localStorage.getItem('access_token')).toBe('fake-access');
    expect(toastSuccessMock).toHaveBeenCalledWith('Logged in successfully');
    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  it('falls back to register on 404 and redirects to /create-display-name', async () => {
    popUpMock.mockResolvedValue({ user });
    axiosPostMock
      .mockRejectedValueOnce({ response: { status: 404 } })        // login fails
      .mockResolvedValueOnce({ data: { isNewUser: true } });       // register OK

    const { result } = renderHook(() => useLoginOauth());
    await act(async () => result.current.loginWithGoogle());

    expect(axiosPostMock).toHaveBeenCalledWith('/auth/register/oauth', { idToken: 'id-token' });
    expect(toastSuccessMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith(
      `/create-display-name?token=${encodeURIComponent('id-token')}`
    );
    expect(result.current.error).toBeNull();
  });

  /* ─── login error cases (400, 403, generic 500) ─── */
  const loginErrorCases: Array<[number, string]> = [
    [400, 'Invalid token'],
    [403, 'Wrong account'],
    [500, 'Server down'],
  ];

  loginErrorCases.forEach(([status, backendMsg]) => {
    it(`shows toast and keeps error null for login status ${status}`, async () => {
      popUpMock.mockResolvedValue({ user });
      axiosPostMock.mockRejectedValueOnce({
        response: { status, data: { message: backendMsg } },
      });

      const { result } = renderHook(() => useLoginOauth());
      await act(async () => result.current.loginWithGoogle());

      expect(result.current.error).toBeNull();
      expect(toastErrorMock).toHaveBeenCalled();
      expect(navigateMock).not.toHaveBeenCalled();
    });
  });
});
