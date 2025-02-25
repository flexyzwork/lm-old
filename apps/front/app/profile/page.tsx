import ProfileHeader from '@/components/ProfileHeader';
import PortfolioList from '@/components/PortfolioList';
import ContactButton from '@/components/ContactButton';

// interface ProfilePageProps {
//   params: { id: string };
// }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProfilePage({ params }: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = await params;

  // 🚀 실제로는 DB에서 데이터를 가져와야 함 (예: fetch(`/api/freelancers/${params.id}`))
  // const res = await fetch(`http://localhost:4000/api/freelancers/${id}`);
  // if (!res.ok) throw new Error("프리랜서 데이터를 가져올 수 없습니다.");
  // const freelancer = await res.json();

  const freelancer = {
    id: params.id,
    name: '김개발',
    job: '프론트엔드 개발자',
    skills: ['React', 'Next.js', 'TypeScript'],
    image: '/default-profile.png',
    portfolio: [
      {
        title: '웹사이트 개발',
        description: 'React 기반 웹 앱 개발',
        image: '/work-1.png',
      },
      {
        title: '대시보드 UI',
        description: '관리자 페이지 UI 디자인 및 구현',
        image: '/work-2.png',
      },
    ],
  };

  return (
    <div className="container mx-auto py-10">
      {/* 프리랜서 정보 */}
      <ProfileHeader freelancer={freelancer} />

      {/* 포트폴리오 리스트 */}
      <PortfolioList portfolio={freelancer.portfolio} />

      {/* 연락하기 버튼 */}
      <div className="text-center mt-10">
        <ContactButton freelancer={freelancer} />
      </div>
    </div>
  );
}
