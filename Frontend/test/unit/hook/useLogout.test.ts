/**
 * test/unit/hooks/useLogout.test.ts
 */
import React from 'react';  
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

/* ─── secure.api mock ─────────────────────────────────────────────────────── */
vi.mock('../../../src/services/axios/secure.api', () => ({
  default: { post: vi.fn() },
}));
import secureApi from '../../../src/services/axios/secure.api';
const postMock = secureApi.post as unknown as Mock;

/* ─── toast (sonner) mock ─────────────────────────────────────────────────── */
vi.mock('sonner', () => ({ toast: { info: vi.fn() } }));
import { toast } from 'sonner';
const toastInfoMock = toast.info as unknown as Mock;

/* ─── react-router-dom (navigate) mock ────────────────────────────────────── */
const navigateMock = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => navigateMock };
});

/* ─── hook under test ─────────────────────────────────────────────────────── */
import useLogout from '../../../src/hooks/useLogout';

/* ─── wrapper (router context) ────────────────────────────────────────────── */
const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(MemoryRouter, null, children);


describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('access_token', 'dummy'); // preset to ensure removal
  });

  it('calls backend, clears token and navigates on success', async () => {
    postMock.mockResolvedValueOnce({ status: 204 });

    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current(); // call logout
    });

    expect(postMock).toHaveBeenCalledWith('/auth/logout');
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(toastInfoMock).toHaveBeenCalledWith(
      'Session expired, please log in again'
    );
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });

  it('still clears token and navigates if backend fails', async () => {
    postMock.mockRejectedValueOnce(new Error('Network down'));

    const { result } = renderHook(() => useLogout(), { wrapper });

    await act(async () => {
      await result.current(); // call logout
    });

    expect(postMock).toHaveBeenCalledWith('/auth/logout');
    expect(localStorage.getItem('access_token')).toBeNull();
    expect(toastInfoMock).toHaveBeenCalled();
    expect(navigateMock).toHaveBeenCalledWith('/login');
  });
});
