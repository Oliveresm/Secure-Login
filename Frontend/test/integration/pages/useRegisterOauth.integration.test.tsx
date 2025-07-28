// tests/unit/hooks/useRegisterOauth.test.ts
import { describe, it, vi, expect, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import useRegisterOauth from '../../../src/modules/public/Register/hooks/useRegisterOauth';
import * as firebaseAuth from 'firebase/auth';
import authApi from '../../../src/services/axios/auth.api';

vi.mock('react-router-dom', () => ({ useNavigate: vi.fn() }));

vi.mock('firebase/auth', async () => {
  const actual: any = await vi.importActual('firebase/auth');
  return {
    ...actual,
    getAuth: vi.fn(),
    signInWithPopup: vi.fn(),
    GoogleAuthProvider: vi.fn(),
  };
});

vi.mock('../../../src/services/axios/auth.api');

const mockNavigate = vi.fn();
(useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

const mockSignInWithPopup = firebaseAuth.signInWithPopup as unknown as Mock;
const mockGetAuth = firebaseAuth.getAuth as unknown as Mock;
const mockGoogleProvider = firebaseAuth.GoogleAuthProvider as unknown as Mock;
const mockPost = authApi.post as unknown as Mock;

beforeEach(() => {
  vi.clearAllMocks();
  mockGetAuth.mockReturnValue({});
  mockGoogleProvider.mockReturnValue({});
});

describe('useRegisterOauth', () => {
  it('redirects to /create-display-name on successful registration with isNewUser=true', async () => {
    const fakeToken = 'fake.jwt.token';
    mockSignInWithPopup.mockResolvedValue({ user: { getIdToken: () => Promise.resolve(fakeToken) } });
    mockPost.mockResolvedValue({
      data: { isNewUser: true },
    });

    const { result } = renderHook(() => useRegisterOauth());

    await act(async () => {
      await result.current.registerWithGoogle();
    });

    expect(mockPost).toHaveBeenCalledWith('/auth/register/oauth', { idToken: fakeToken });
    expect(mockNavigate).toHaveBeenCalledWith(`/create-display-name?token=${encodeURIComponent(fakeToken)}`);
    expect(result.current.error).toBeNull();
  });

  it('tries login if registration fails with 409 and then redirects to /dashboard on success', async () => {
    const fakeToken = 'fake.jwt.token';
    mockSignInWithPopup.mockResolvedValue({ user: { getIdToken: () => Promise.resolve(fakeToken) } });

    mockPost
      .mockRejectedValueOnce({ response: { status: 409 } }) // register fails
      .mockResolvedValueOnce({ data: { accessToken: 'access' } }); // login succeeds

    const { result } = renderHook(() => useRegisterOauth());

    await act(async () => {
      await result.current.registerWithGoogle();
    });

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    expect(result.current.error).toBeNull();
  });

  const errorCases: Array<[number, string]> = [
    [400, 'Invalid or missing token.'],
    [401, 'Your account is not verified yet.'],
    [403, 'Google account does not match the registered user.'],
  ];

  errorCases.forEach(([status, expectedMessage]) => {
    it(`sets error message "${expectedMessage}" for status ${status}`, async () => {
      mockSignInWithPopup.mockResolvedValue({ user: { getIdToken: () => Promise.resolve('token') } });
      mockPost.mockRejectedValue({ response: { status, data: { message: expectedMessage } } });

      const { result } = renderHook(() => useRegisterOauth());

      await act(async () => {
        await result.current.registerWithGoogle();
      });

      expect(result.current.error).toBe(expectedMessage);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
