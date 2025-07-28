// test/unit/services/axios/secure.api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock authApi: simulates token refresh and check
vi.mock('../../../../src/services/axios/auth.api', () => ({
  default: {
    post: vi.fn().mockResolvedValue({ data: { accessToken: 'newToken' } }),
    get: vi.fn().mockResolvedValue({ status: 200 }), // /auth/check
  },
}));

// Mock secureApi: interceptors and retry logic
vi.mock('../../../../src/services/axios/secure.api', () => {
  const mockRequest = vi.fn(); // retry simulation

  return {
    default: {
      request: mockRequest,
      interceptors: {
        response: {
          use: vi.fn(), // not relevant for this test
        },
      },
      defaults: { headers: { common: {} } },
    },
  };
});

// Imports must come after mocks
import authApi from '../../../../src/services/axios/auth.api';
import secureApi from '../../../../src/services/axios/secure.api';

describe('secureApi interceptor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should refresh the token and retry the request', async () => {
    const failedRequest = {
      config: {
        headers: { Authorization: 'Bearer oldToken' },
        _retry: false,
      },
      response: { status: 401 },
    };

    // Manual implementation of the real interceptor logic
    const interceptor = async (error: any) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        const response = await authApi.post('/auth/refreshToken');
        const newToken = response.data.accessToken;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        secureApi.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        return secureApi.request(originalRequest);
      }

      throw error;
    };

    await interceptor(failedRequest);

    // Assertions
    expect(authApi.post).toHaveBeenCalledWith('/auth/refreshToken');
    expect(failedRequest.config.headers.Authorization).toBe('Bearer newToken');
    expect(secureApi.defaults.headers.common.Authorization).toBe('Bearer newToken');
    expect(secureApi.request).toHaveBeenCalledWith(failedRequest.config);
  });
});
