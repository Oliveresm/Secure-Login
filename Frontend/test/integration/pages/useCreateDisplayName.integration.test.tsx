/**
 * test/unit/hooks/useCreateDisplayName.test.ts
 */
import { renderHook, act } from '@testing-library/react';
import {
  describe,
  it,
  beforeEach,
  expect,
  vi,
  type Mock,
} from 'vitest';
import { MemoryRouter } from 'react-router-dom';

/* ─── fake timers ─────────────────────────────────────────────────────────── */
vi.useFakeTimers();

/* ─── secure.api (patch) ──────────────────────────────────────────────────── */
vi.mock('../../../src/services/axios/secure.api', () => ({
  default: { patch: vi.fn() },
}));
import authApi from '../../../src/services/axios/secure.api';
const patchMock = authApi.patch as unknown as Mock;

/* ─── public api (post login) ─────────────────────────────────────────────── */
vi.mock('../../../src/services/axios/auth.api', () => ({
  default: { post: vi.fn() },
}));
import publicApi from '../../../src/services/axios/auth.api';
const postMock = publicApi.post as unknown as Mock;

/* ─── toast (sonner) ──────────────────────────────────────────────────────── */
vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));
import { toast } from 'sonner';
const toastSuccessMock = toast.success as unknown as Mock;
const toastErrorMock   = toast.error   as unknown as Mock;

/* ─── react-router (navigate) ─────────────────────────────────────────────── */
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

/* ─── hook under test (import last) ───────────────────────────────────────── */
import useCreateDisplayName from '../../../src/modules/public/CreateDisplayName/hooks/useCreateDisplayName';

/* ─── router wrapper ──────────────────────────────────────────────────────── */
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
);

/* ─── helpers ─────────────────────────────────────────────────────────────── */
const token = 'mock-firebase-token';
const encodedToken = encodeURIComponent(token);

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});

/* ───────────────────────── tests ─────────────────────────────────────────── */
describe('useCreateDisplayName', () => {
  it('updates the name, logs in and redirects to dashboard', async () => {
    patchMock.mockResolvedValueOnce({ status: 204 });
    postMock.mockResolvedValueOnce({ data: { accessToken: 'fake-access' } });

    const { result } = renderHook(() => useCreateDisplayName(), { wrapper });

    await act(async () =>
      result.current.submit({ displayName: 'newName', token })
    );

    expect(patchMock).toHaveBeenCalledWith(
      `/auth/update-name/oauth?token=${token}`,
      { newName: 'newName' }
    );

    expect(postMock).toHaveBeenCalledWith('/auth/login/oauth', {
      idToken: token,
    });

    expect(localStorage.getItem('access_token')).toBe('fake-access');
    expect(result.current.success).toBe(true);
    expect(toastSuccessMock).toHaveBeenCalledWith(
      'Display name updated successfully!'
    );

    // execute the 500ms setTimeout
    vi.runAllTimers();

    expect(navigateMock).toHaveBeenCalledWith('/dashboard');
  });

  it('shows 409 error if the name already exists', async () => {
    patchMock.mockRejectedValueOnce({
      response: { status: 409, data: { message: 'Display name already exists' } },
    });

    const { result } = renderHook(() => useCreateDisplayName(), { wrapper });

    await act(async () =>
      result.current.submit({ displayName: 'duplicate', token })
    );

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Display name already exists');
    expect(toastErrorMock).toHaveBeenCalledWith(
      'That display name is already taken. Try another one.'
    );
    expect(postMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('handles generic 500 error', async () => {
    patchMock.mockRejectedValueOnce({
      response: { status: 500, data: { message: 'Internal Server Error' } },
    });

    const { result } = renderHook(() => useCreateDisplayName(), { wrapper });

    await act(async () =>
      result.current.submit({ displayName: 'errName', token })
    );

    expect(result.current.success).toBe(false);
    expect(result.current.error).toBe('Internal Server Error');
    expect(toastErrorMock).toHaveBeenCalledWith('Internal Server Error');
    expect(postMock).not.toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
  });
});
