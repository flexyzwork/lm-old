import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/authStore';

const UserProfileButton = () => {
  const { user } = useAuthStore();

  return (
    <div className="relative">
      <Link href="/user/profile" className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.picture ?? ''} alt="Profile" />
          <AvatarFallback>{user?.name?.charAt(0) ?? 'U'}</AvatarFallback>
        </Avatar>
        <span className="text-white sm:hidden">{user?.name?.charAt(0) ?? 'U'}</span>
        <span className="text-white hidden sm:inline">{user?.name}</span>
      </Link>
    </div>
  );
};

export default UserProfileButton;
