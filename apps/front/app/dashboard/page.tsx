'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { fetchProfile, fetchWithAuth } from '@/lib/auth';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const isLoggedIn = !!user;
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [portfolios, setPortfolios] = useState<{ id: string; title: string; description: string }[]>([]);
  const [projects, setProjects] = useState<{ id: string; title: string; status: string }[]>([]);
  // const [contracts, setContracts] = useState([]);
  // const [proposals, setProposals] = useState([]);
  // const [reviews, setReviews] = useState([]);
  // const [averageRating, setAverageRating] = useState<number>(0);

  useEffect(() => {
    async function checkAuth() {
      if (!isLoggedIn) {
        const userData = await fetchProfile(); // ✅ 로그인 상태 복구
        if (!userData) {
          router.push('/auth/login'); // 로그인 실패 시 로그인 페이지로 이동
        }
      } else {
        await fetchUserData(); // ✅ 사용자 데이터 로드
      }
    }
    checkAuth();
  }, [isLoggedIn, router]);

  const fetchUserData = async () => {
    try {
      setLoading(true);

      if (!user?.id) return;

      console.log('🔍 API 요청 userId:', user.id);

      const [portfolioData, projectData /* contractData, proposalData, reviewData */] = await Promise.all([
        fetchWithAuth(`/api/portfolios/?userId=${user.id}`).catch(() => null),
        fetchWithAuth(`/api/projects/?userId=${user.id}`).catch(() => null),
        // fetchWithAuth(`/api/contracts/?userId=${user.id}`).catch(() => null),
        // fetchWithAuth(`/api/proposals/?userId=${user.id}`).catch(() => null),
        // fetchWithAuth(`/api/reviews/?userId=${user.id}`).catch(() => null),
      ]);

      console.log('✅ API 응답 확인:', { portfolioData, projectData /* contractData, proposalData, reviewData */ });

      // API 응답이 비어 있을 경우 빈 배열 유지
      setPortfolios(portfolioData || []);
      setProjects(projectData || []);
      // setContracts(contractData || []);
      // setProposals(proposalData || []);
      // setReviews(reviewData || []);

      if (Array.isArray(portfolioData)) {
        setPortfolios(portfolioData as { id: string; title: string; description: string }[]);
      }

      if (Array.isArray(projectData)) {
        setProjects(projectData as { id: string; title: string; status: string }[]);
      }
      // ✅ 평균 평점 계산
      // if (reviewData && reviewData.length > 0) {
      //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
      //   const avgRating = reviewData.reduce((sum: any, review: any) => sum + review.rating, 0) / reviewData.length;
      //   setAverageRating(avgRating);
      // }
    } catch (error) {
      console.error('❌ 데이터 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      {/* ✅ 상단 유저 정보 */}
      <div className="flex justify-between items-center px-6 py-4 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <img
            src={user?.picture || '/default-profile.png'}
            alt="User Avatar"
            className="w-16 h-16 rounded-full border"
          />
          <div>
            <p className="text-xl font-semibold">{user?.name || '사용자'}</p>
            <p className="text-sm text-gray-500">{user?.email || '이메일 없음'}</p>
            <p className="text-sm text-gray-400">가입일: {user?.created_at || '알 수 없음'}</p>
          </div>
        </div>
        <button
          onClick={() => router.push('/profile/edit')}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          프로필 편집
        </button>
      </div>

      <h2 className="text-3xl font-bold text-center mt-6">대시보드</h2>

      {loading ? (
        <p className="text-center text-gray-500 mt-4">로딩 중...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {/* ✅ 포트폴리오 관리 섹션 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">내 포트폴리오 ({portfolios.length})</h3>

            {/* ✅ 포트폴리오 추가 버튼 */}
            <button
              onClick={() => router.push('/portfolios/new')}
              className="mb-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              + 새 포트폴리오 추가
            </button>

            {/* ✅ 포트폴리오 목록 */}
            {portfolios.length > 0 ? (
              <ul className="space-y-4">
                {portfolios.map((portfolio) => (
                  <li
                    key={portfolio.id}
                    className="p-4 bg-gray-100 dark:bg-gray-700 shadow-md rounded-lg flex justify-between items-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    onClick={() => router.push(`/portfolios/${portfolio.id}`)}
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{portfolio.title}</h3>
                      <p className="text-gray-500">{portfolio.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 요소 클릭 방지
                        router.push(`/portfolios/edit/${portfolio.id}`);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      편집
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">등록된 포트폴리오가 없습니다.</p>
            )}
          </div>

          {/* ✅ 진행 중인 프로젝트 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">진행 중인 프로젝트 ({projects.length})</h3>
            {projects.length > 0 ? (
              <ul className="text-gray-500">
                {projects.map((p) => (
                  <li key={p.id} className="mt-2">
                    {p.title} - {p.status === 'pending' ? '대기 중' : p.status === 'in_progress' ? '진행 중' : '완료'}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">등록된 프로젝트가 없습니다.</p>
            )}
          </div>

          {/* ✅ 리뷰 및 평점 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">받은 리뷰</h3>
            <p className="text-gray-500">평균 평점: {/* averageRating.toFixed(1) */} 5 / 5</p>
          </div>
        </div>
      )}
    </div>
  );
}
