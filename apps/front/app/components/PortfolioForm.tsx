'use client';
import { usePortfolioStore } from '@/lib/store/portfolioStore';
import { uploadPortfolio } from '@/app/actions/uploadPortfolio';
import TechTagSelector from './TechTagSelector';
import { fetchWithAuth } from '@/lib/auth';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';

export default function PortfolioForm() {
  const router = useRouter();

  const { user } = useAuthStore();

  const { title, description, file, tags, setTitle, setDescription, setFile, setTags, reset } = usePortfolioStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert('파일을 업로드하세요!');

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('tags', JSON.stringify(tags));
    formData.append('file', file);

    const { filePath } = await uploadPortfolio(formData);
    const res = await fetchWithAuth('/api/portfolios', {
      method: 'POST',
      body: JSON.stringify({
        user_id: user?.id,
        title,
        description,
        tags,
        filePath,
      }),
    });

    console.log('res:', res);

    // ✅ 알림창을 띄우고 사용자 선택에 따라 동작 결정
    const userChoice = confirm(`포트폴리오가 등록되었습니다!\n\n확인을 누르면 대시보드로 이동합니다.`);

    reset(); // ✅ 입력 폼 초기화 (이미지도 포함)
    setFile(null); // ✅ 이미지 미리보기 초기화

    if (userChoice) {
      router.push('/dashboard'); // ✅ 사용자가 "확인"을 누르면 대시보드로 이동
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      {/* 제목 입력 */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full mt-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* 설명 입력 */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">설명</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        className="w-full mt-2 p-2 border rounded dark:bg-gray-700 dark:text-white"
      />

      {/* 기술 스택 선택 */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">기술 스택</label>
      <TechTagSelector selectedTech={tags} setSelectedTech={setTags} />

      {/* 파일 업로드 */}
      <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">이미지 업로드</label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file && file.size > 10 * 1024 * 1024) {
            // 10MB 제한
            alert('파일 크기가 너무 큽니다. (최대 10MB)');
            return;
          }
          setFile(file || null);
        }}
        required
        className="w-full mt-2 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
      />

      {/* 제출 버튼 */}
      <button type="submit" className="mt-6 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
        등록하기
      </button>
    </form>
  );
}

// 'use client';

// import { useState } from 'react';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// const PortfolioForm = ({ freelancerId, onUpload }: any) => {
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     image: '',
//   });
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage('');

//     try {
//       const res = await fetch('/api/portfolio', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ freelancerId, ...formData }),
//       });

//       if (res.ok) {
//         setMessage('Portfolio successfully created!');
//         setFormData({ title: '', description: '', image: '' });
//         onUpload(); // ✅ 업로드 후 mutate 호출
//       } else {
//         setMessage('Failed to create portfolio.');
//       }
//     } catch {
//       setMessage('Error submitting form.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
//         <h2 className="text-2xl font-bold mb-4">Upload New Portfolio</h2>
//         <form onSubmit={handleSubmit}>
//           <label className="block mb-2">Title:</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           />

//           <label className="block mb-2">Description:</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//             required
//           ></textarea>

//           <label className="block mb-2">Image URL:</label>
//           <input
//             type="text"
//             name="image"
//             value={formData.image}
//             onChange={handleChange}
//             className="w-full p-2 border rounded mb-4"
//           />

//           <button
//             type="submit"
//             className="bg-blue-600 text-white px-4 py-2 rounded w-full"
//             disabled={loading}
//           >
//             {loading ? 'Uploading...' : 'Upload'}
//           </button>
//         </form>
//         {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
//       </div>
//     </>
//   );
// };

// export default PortfolioForm;
