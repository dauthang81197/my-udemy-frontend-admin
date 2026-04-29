import axiosInstance from './axiosInstance';
import { env } from '@/config/env';
import type { ApiResponse } from '@/types/api.types';
import type { LoginRequest, LoginResponse, RegisterRequest } from '@/types/auth.types';

const BASE = env.authServicePrefix;

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<ApiResponse<LoginResponse>>(`${BASE}/login`, data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<ApiResponse<{ username: string; email: string }>>(`${BASE}/register`, data),
};
