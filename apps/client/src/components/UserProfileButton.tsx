import { useAuth} from '@/hooks/useAuth';
import Link from 'next/link';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';


const UserProfileButton = () => {
  const { user, handleLogout } = useAuth();

  if (!user) return null;

  return (
    <div className="relative">
      <Link href="/profile" className="flex items-center space-x-2">
        <Avatar className="h-8 w-8">
          {/* <AvatarImage src={user?.profileImage ?? ''} alt="Profile" />
          <AvatarFallback>{user.name?.charAt(0) ?? 'U'}</AvatarFallback> */}
        </Avatar>
        <span className="text-white hidden sm:inline">{user.name}</span>
      </Link>
      <button
        onClick={handleLogout}
        className="absolute top-full left-0 mt-2 px-3 py-2 text-sm bg-red-600 text-white rounded shadow-lg"
      >
        Logout
      </button>
    </div>
  );
};

export default UserProfileButton;
