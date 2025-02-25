'use client';

import ProfileCard from '@/components/ProfileCard';
// import { useParams } from 'next/navigation';
// import useSWR from 'swr';

// const fetcher = (url: string) => fetch(url).then((res) => res.json());



export default function FreelancerProfile() {
  const freelancer = {
    name: 'John Doe',
    title: 'Full-Stack Developer',
    bio: 'Experienced developer specializing in Next.js and Tailwind CSS.',
    profileImage: 'https://live.staticflickr.com/65535/54056679061_91500632c5_b.jpg',
    skills: ['Next.js', 'React', 'Tailwind CSS', 'TypeScript'],
    portfolio: [
      {
        image:
          'https://live.staticflickr.com/65535/54054130573_6c7cb4f3b0_b.jpg',
        title: 'Portfolio Website',
      },
      {
        image:
          'https://live.staticflickr.com/65535/54056679061_91500632c5_b.jpg',
        title: 'E-commerce App',
      },
    ],
  };
  // const params = useParams();
  // const freelancerId = params.id;

  // const { data: freelancer, mutate: mutateFreelancer } = useSWR(
  //   `/api/freelancers/${freelancerId}`,
  //   fetcher
  // );

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4">
      <ProfileCard {...freelancer} />
    </main>
  );
}
