export interface UserProfile {
  id: string;
  username: string;
  email: string;
  full_name: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export type UserStatus = 'ACTIVE' | 'BLOCKED' | 'PENDING';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userProfile: UserProfile;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  fullName: string;
}
