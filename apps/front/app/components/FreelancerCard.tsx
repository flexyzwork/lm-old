import Link from 'next/link';

interface FreelancerProps {
  name: string;
  skill: string;
  image: string;
}

export default function FreelancerCard({
  name,
  skill,
  image,
}: FreelancerProps) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <img src={image} alt={name} className="w-16 h-16 rounded-full mb-4" />
      <h4 className="text-lg font-bold">{name}</h4>
      <p className="text-gray-500 dark:text-gray-400">{skill}</p>
      <Link
        href="/profile/1"
        className="mt-4 inline-block text-blue-500 hover:underline"
      >
        프로필 보기 →
      </Link>
    </div>
  );
}
