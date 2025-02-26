// src/hooks/useAuth.ts
import { useDispatch, useSelector } from 'react-redux';
import { login, logout } from '@/state/authSlice';
import { RootState } from '@/state/redux';
import { registerUser, useLoginUser } from '@/lib/auth';

export const useAuth = () => {
  const { loginUser } = useLoginUser();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);


  // const handleLogin = (user: { id: string; name: string; email: string; roles: string[] }, token: string) => {
    // dispatch(login({ user, token }));

  // };

  const handleLogin = async (email: string, password: string) => {
    const res = await loginUser(email, password);
    if (res.success) {
      // 로그인 성공 후 처리
    } else {
      // 로그인 실패 처리
    }
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleRegister = async (email: string, password: string) => {
    const result = await registerUser(email, password);
    if (result.success) {
      handleLogin(result.user, result.token);  // 로그인 후 상태 업데이트
    } else {
      return result.error;
    }
  };


  return { user, accessToken, handleLogin, handleLogout, handleRegister };
};