'use client';
import Image from 'next/image';

interface ProfileProps {
  name: string;
  title: string;
  bio: string;
  profileImage: string;
  skills: string[];
  portfolio: { image: string; title: string }[];
}

const ProfileCard: React.FC<ProfileProps> = ({
  name,
  title,
  bio,
  profileImage,
  skills,
  // links,
  portfolio,
}) => {
  return (
    <div
      className="w-full max-w-4xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                    p-8 rounded-lg shadow-lg transition-all"
    >
      {/* 프로필 정보 */}
      <div className="flex items-center space-x-6">
        <Image
          src={profileImage}
          alt="Profile Picture"
          width={100}
          height={100}
          className="rounded-full object-cover"
        />
        <div>
          <h2 className="text-3xl font-bold">{name}</h2>
          <p className="text-gray-600 dark:text-gray-400">{title}</p>
        </div>
      </div>

      <p className="mt-6 text-lg">{bio}</p>

      {/* 기술 태그 */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold">Skills</h3>
        <div className="flex flex-wrap gap-3 mt-3">
          {skills.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-2 rounded-md text-sm bg-gray-300 dark:bg-gray-700"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 포트폴리오 섹션 */}
      <div className="mt-8">
        <h3 className="text-xl font-semibold">Portfolio</h3>
        <div className="grid grid-cols-2 gap-6 mt-3">
          {portfolio.map((item, index) => (
            <div
              key={index}
              className="p-4 rounded-md bg-gray-200 dark:bg-gray-700 shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={200}
                height={150}
                className="rounded-md object-cover"
              />
              <p className="mt-3 text-md">{item.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
