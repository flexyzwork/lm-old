import axios from 'axios';

// 사용자 프로필을 가져오는 함수
export const getUserProfile = async (token: string) => {
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get('/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    // // 토큰 만료 또는 다른 오류 발생 시
    // if (axios.isAxiosError(error) && error.response?.status === 401) {
    //   throw new Error('Authentication token is invalid or expired');
    // } else {
    //   throw new Error('Error fetching user profile');
    // }
  }
};
