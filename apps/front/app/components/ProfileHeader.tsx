// import Image from 'next/image';

// interface Freelancer {
//   name: string;
//   email: string;
//   website?: string;
//   profileImage?: string;
//   title: string;
//   skills: string[];
// }

// const ProfileHeader = ({ freelancer }: { freelancer: Freelancer }) => {
//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 flex items-center space-x-6">
//       <Image
//         src={freelancer.profileImage || '/default-profile.png'}
//         alt={freelancer.name}
//         className="w-24 h-24 rounded-full border"
//         width={24}
//         height={24}
//       />
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">{freelancer.name}</h1>
//         <p className="text-gray-600">{freelancer.title}</p>
//         <div className="mt-2 flex flex-wrap gap-2">
//           {freelancer.skills.map((skill, index) => (
//             <span
//               key={index}
//               className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProfileHeader;


interface ProfileHeaderProps {
  freelancer: {
    name: string;
    job: string;
    skills: string[];
    image: string;
  };
}

export default function ProfileHeader({ freelancer }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <img src={freelancer.image} alt={freelancer.name} className="w-24 h-24 rounded-full mb-4" />
      <h2 className="text-2xl font-bold">{freelancer.name}</h2>
      <p className="text-gray-500">{freelancer.job}</p>
      <div className="mt-4 flex gap-2">
        {freelancer.skills.map((skill, index) => (
          <span key={index} className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}