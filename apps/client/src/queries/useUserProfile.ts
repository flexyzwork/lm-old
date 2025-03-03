// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
// import { fetchProfile, updateProfile } from '@/services/authService';

// // ✅ 프로필 불러오기 (React Query)
// export const useUserProfile = () => {
//   return useQuery({
//     queryKey: ['profile'],
//     queryFn: fetchProfile,
//     staleTime: 1000 * 60 * 14,
//   });
// };

// // ✅ 프로필 업데이트
// export const useUpdateProfile = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: updateProfile,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['profile'] });

//       alert('프로필이 성공적으로 업데이트되었습니다!');
//     },
//     onError: () => {
//       alert('프로필 업데이트에 실패했습니다.');
//     },
//   });
// };
