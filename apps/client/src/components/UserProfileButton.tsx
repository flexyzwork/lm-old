// import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
// import { useGetUserProfileQuery } from '@/state/api';
import { useAuthStore } from '@/lib/store/authStore';

const UserProfileButton = () => {
  // const { data, error: queryError } = useGetUserProfileQuery(undefined); // RTK 쿼리로 프로필 데이터 가져오기
  // const user = data?.user;

  // if (!user) return null;
  const { user } = useAuthStore();

  console.log('user', user);

  return (
    <div className="relative">
      <Link href="/user/profile" className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          {/* <AvatarImage src={user?.profileImage ?? ''} alt="Profile" />
          <AvatarFallback>{user.name?.charAt(0) ?? 'U'}</AvatarFallback> */}
        </Avatar>
        <span className="text-white sm:hidden">{user?.name?.charAt(0) ?? 'U'}</span>
        <span className="text-white hidden sm:inline">{user?.name}</span>
      </Link>
    </div>
  );
};

export default UserProfileButton;
