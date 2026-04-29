import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { message } from 'antd';
import { authApi } from '@/api/authApi';
import { useAuthStore } from '@/store/authStore';
import { getApiErrorMessage } from '@/utils/helpers';
import type { LoginFormValues } from '../schemas/loginSchema';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: ({ data }) => {
      const { accessToken, refreshToken, userProfile } = data.data;
      setAuth(accessToken, refreshToken, userProfile);
      message.success('Login successful');
      navigate('/dashboard');
    },
    onError: (error) => {
      message.error(getApiErrorMessage(error, 'Invalid email or password'));
    },
  });
}
