// import { useDispatch } from 'react-redux';
// import { useLoginMutation, useLogoutMutation, useRegisterMutation, useSocialLoginMutation } from '@/state/api';
// import { login, logout } from '@/state/auth';

// export const useAuth = () => {
//   const dispatch = useDispatch();
//   const [loginUser] = useLoginMutation();
//   const [socialLogin] = useSocialLoginMutation();
//   const [logoutUser] = useLogoutMutation();
//   const [registerUser] = useRegisterMutation();

//   const handleLogin = async (email: string, password: string) => {
//     const { data, error } = await loginUser({ email, password });
//     console.log(data, error);
//     if (data) {
//       dispatch(login(data)); // 로그인 성공 후 Redux 상태 업데이트
//     }
//     return error ? error : null;
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     logoutUser(); // 로그아웃 처리
//   };

//   const handleRegister = async (email: string, password: string) => {
//     const { data, error } = await registerUser({ email, password });
//     console.log(data, error);
//     if (data) {
//       dispatch(login(data)); // 회원가입 후 자동 로그인
//     }
//     return error ? error : null;
//   };

//   const handleSocialLogin = async (provider: 'google' | 'github') => {
//     // const res = await fetch(`/api/auth/${provider}`);
//     const { data, error } = await socialLogin(provider);
//     if (data?.token) {
//       dispatch(login(data)); // 소셜 로그인 후 Redux 상태 업데이트
//     }
//     return error || null;
//   };



//   return { handleLogin, handleLogout, handleRegister, handleSocialLogin };
// };