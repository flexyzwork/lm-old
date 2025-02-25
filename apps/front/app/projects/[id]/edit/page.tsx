'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function ProjectEditPage() {
  const { id } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<number>(0); // ✅ 초기값 숫자로 변경
  const [techStack, setTechStack] = useState<string>('');
  const [deadline, setDeadline] = useState<string>('');
  const [status, setStatus] = useState<string>('진행 중');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('API 응답 실패');

        const data = await res.json();
        setTitle(data.title || '');
        setDescription(data.description || '');
        setBudget(Number(data.budget) || 0); // ✅ 숫자로 변환
        setTechStack(data.techStack?.join(', ') || '');
        setDeadline(data.deadline || '');
        setStatus(data.status || '진행 중');
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  const handleUpdateProject = async () => {
    if (!title || !description || !budget || !techStack || !deadline || !status) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    const res = await fetch(`/api/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        description,
        budget: budget, // ✅ 숫자로 전달
        techStack: techStack.split(',').map((tech) => tech.trim()),
        deadline,
        status,
      }),
    });

    if (res.ok) {
      alert('프로젝트가 업데이트되었습니다!');
      router.push(`/projects/${id}`);
    } else {
      alert('프로젝트 업데이트에 실패했습니다.');
    }
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">로딩 중...</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center dark:text-gray-200">프로젝트 편집</h2>

      <div className="mt-6">
        <label className="block font-semibold dark:text-gray-200">프로젝트 제목</label>
        <input
          type="text"
          placeholder="제목 입력"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold dark:text-gray-200">설명</label>
        <textarea
          placeholder="설명 입력"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold dark:text-gray-200">예산 (USD)</label>
        <input
          type="number"
          placeholder="예산 입력"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))} // ✅ 숫자로 변환
          required
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold dark:text-gray-200">기술 스택 (쉼표로 구분)</label>
        <input
          type="text"
          placeholder="React, Next.js, TailwindCSS"
          value={techStack}
          onChange={(e) => setTechStack(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="mt-4">
        <label className="block font-semibold dark:text-gray-200">마감일</label>
        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
          required
          className="w-full p-3 border rounded mt-2 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600"
        />
      </div>

      <div className="mt-4 flex gap-4">
        <button
          onClick={handleUpdateProject}
          className="w-1/2 px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          업데이트 저장
        </button>
        <button
          onClick={() => router.back()}
          className="w-1/2 px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 dark:bg-gray-700 dark:hover:bg-gray-800"
        >
          취소
        </button>
      </div>
    </div>
  );
}
