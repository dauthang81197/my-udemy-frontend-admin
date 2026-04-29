import type { UserStatus } from './auth.types';

export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserStatusRequest {
  status: UserStatus;
}
