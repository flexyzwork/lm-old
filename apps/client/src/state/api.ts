import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BaseQueryApi, FetchArgs } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';
// import { RootState } from '@/state/redux';
import { useAuthStore } from '@/lib/store/authStore';

const customBaseQuery = async (args: string | FetchArgs, api: BaseQueryApi, extraOptions: any) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // const token = (getState() as RootState).auth.accessToken;
      const token = useAuthStore.getState().accessToken;

      console.log('token', token);
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status.toString() || 'An error occurred';
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== 'GET';

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (result.error?.status === 204 || result.meta?.response?.status === 24) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return { error: { status: 'FETCH_ERROR', error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: 'api',
  tagTypes: ['Courses', 'Users', 'UserCourseProgress'],
  endpoints: (build) => ({
    /* 
    ===============
    USER
    =============== 
    */
    // login: build.mutation<{ token: string; user: User }, { email: string; password: string }>({
    //   query: (credentials) => ({
    //     url: 'auth/login',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),
    // register: build.mutation<{ token: string; user: User }, { email: string; password: string }>({
    //   query: (credentials) => ({
    //     url: 'auth/register',
    //     method: 'POST',
    //     body: credentials,
    //   }),
    // }),
    // // 소셜 로그인 (구글, 깃허브)
    // socialLogin: build.mutation<{ token: string; user: User }, 'google' | 'github' >({
    //   query: (provider) => ({
    //     url: `auth/${provider}`,
    //     method: 'GET',
    //   }),
    // }),
    // logout: build.mutation<void, void>({
    //   query: () => ({
    //     url: 'auth/logout',
    //     method: 'POST',
    //   }),
    // }),
    // refresh: build.mutation<{ token: string; refreshToken: string }, string>({
    //   query: (refreshToken) => ({
    //     url: 'auth/refresh',
    //     method: 'POST',
    //     body: { refreshToken },
    //   }),
    // }),
    updateUser: build.mutation<User, Partial<User> & { id: string }>({
      query: ({ id, ...updatedUser }) => ({
        url: `users/${id}`,
        method: 'PATCH',
        body: updatedUser,
      }),
      invalidatesTags: ['Users'],
    }),
    // getUserProfile: build.query({
    //   query: () => 'auth/profile', // 프로필 정보를 가져오는 API 호출
    //   providesTags: (result, error, id) => [{ type: 'Users', id }],
    // }),
    /* 
    ===============
    COURSES
    =============== 
    */
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: 'courses',
        params: { category },
      }),
      providesTags: ['Courses'],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: 'Courses', id }],
    }),

    createCourse: build.mutation<Course, { teacherId: string; teacherName: string }>({
      query: (body) => ({
        url: `courses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Courses'],
    }),

    updateCourse: build.mutation<Course, { courseId: string; formData: FormData }>({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [{ type: 'Courses', id: courseId }],
    }),

    deleteCourse: build.mutation<{ message: string }, string>({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Courses'],
    }),

    getUploadVideoUrl: build.mutation<
      { uploadUrl: string; videoUrl: string },
      {
        courseId: string;
        chapterId: string;
        sectionId: string;
        fileName: string;
        fileType: string;
      }
    >({
      query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: 'POST',
        body: { fileName, fileType },
      }),
    }),

    /* 
    ===============
    TRANSACTIONS
    =============== 
    */
    getTransactions: build.query<Transaction[], string>({
      query: (userId) => `transactions?userId=${userId}`,
    }),
    createStripePaymentIntent: build.mutation<{ clientSecret: string }, { amount: number }>({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: 'POST',
        body: { amount },
      }),
    }),
    createTransaction: build.mutation<Transaction, Partial<Transaction>>({
      query: (transaction) => ({
        url: 'transactions',
        method: 'POST',
        body: transaction,
      }),
    }),

    /* 
    ===============
    USER COURSE PROGRESS
    =============== 
    */
    getUserEnrolledCourses: build.query<Course[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ['Courses', 'UserCourseProgress'],
    }),

    getUserCourseProgress: build.query<UserCourseProgress, { userId: string; courseId: string }>({
      query: ({ userId, courseId }) => `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ['UserCourseProgress'],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: 'PUT',
        body: progressData,
      }),
      invalidatesTags: ['UserCourseProgress'],
      async onQueryStarted({ userId, courseId, progressData }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          api.util.updateQueryData('getUserCourseProgress', { userId, courseId }, (draft) => {
            Object.assign(draft, {
              ...draft,
              sections: progressData.sections,
            });
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  // useLoginMutation,
  // useRegisterMutation,
  // useSocialLoginMutation,
  // useLogoutMutation,
  // useRefreshMutation,
  useUpdateUserMutation,
  // useGetUserProfileQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} = api;
