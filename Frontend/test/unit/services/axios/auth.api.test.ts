// tests/unit/services/axios/auth.api.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock axios and extract mocked methods
vi.mock('axios', () => {
  const mockPost = vi.fn();
  const mockGet = vi.fn();
  const mockUse = vi.fn();

  return {
    default: {
      create: () => ({
        post: mockPost,
        get: mockGet,
        interceptors: {
          response: { use: mockUse }
        },
      }),
      __mockPost: mockPost,
      __mockGet: mockGet,
      __mockUse: mockUse,
    },
  };
});

// Import AFTER mocking
import authApi from '../../../../src/services/axios/auth.api';
import axios from 'axios';

const { __mockPost: mockPost } = axios as any;

beforeEach(() => {
  vi.clearAllMocks();
});

describe('authApi', () => {
  it('should call POST /auth/refreshToken', async () => {
    const mockResponse = { data: { accessToken: 'abc123' } };

    // Set up mock return value
    mockPost.mockResolvedValueOnce(mockResponse);

    // Execute the request
    const res = await authApi.post('/auth/refreshToken');

    // Assertions
    expect(mockPost).toHaveBeenCalledWith('/auth/refreshToken');
    expect(res.data.accessToken).toBe('abc123');
  });
});
