/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

type Project = {
  id: string;
  title: string;
  description: string;
  category: string;
  techStack: string[];
  budget: number;
  deadline: string;
  status: string;
  client: {
    name: string;
    email: string;
    company: string;
  };
  userId: string;
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const [proposalAmount, setProposalAmount] = useState('');
  const [proposalDescription, setProposalDescription] = useState('');

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('API 응답 실패');
        return res.json();
      })
      .then((data: Project) => setProject(data))
      .catch(() => {
        console.error('⚠️ 프로젝트 데이터를 불러오는 데 실패했습니다.');
        setProject(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDeleteProject = async () => {
    if (!confirm('정말 삭제하시겠습니까? 프로젝트는 복구되지 않습니다!')) return;

    const res = await fetch(`/api/projects/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      alert('프로젝트가 삭제되었습니다.');
      router.push('/projects');
    } else {
      alert('프로젝트 삭제에 실패했습니다.');
    }
  };

  const handleCloseProject = async () => {
    if (!confirm('이 프로젝트를 마감하시겠습니까?')) return;

    const res = await fetch(`/api/projects/${id}/close`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: '마감' }),
    });

    if (res.ok) {
      alert('프로젝트가 마감되었습니다.');
      router.refresh();
    } else {
      alert('마감 처리에 실패했습니다.');
    }
  };

  if (loading) return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">로딩 중...</p>;
  if (!project)
    return <p className="text-center text-gray-500 dark:text-gray-400 mt-4">프로젝트 정보를 찾을 수 없습니다.</p>;

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-3xl font-bold dark:text-gray-200">{project.title}</h2>
      <p className="text-gray-600 dark:text-gray-400 mt-2">{project.description}</p>

      {/* ✅ 프로젝트 상세 정보 */}
      <div className="mt-6 bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <p className="text-lg font-semibold dark:text-gray-200">프로젝트 상세 정보</p>
        <ul className="mt-2 space-y-2">
          <li className="text-gray-600 dark:text-gray-400">
            <strong>카테고리:</strong> {project.category || '미정'}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            <strong>기술 스택:</strong> {project.techStack.join(', ') || '없음'}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            <strong>예산:</strong> ${project.budget}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            <strong>마감일:</strong> {project.deadline}
          </li>
          <li className="text-gray-600 dark:text-gray-400">
            <strong>상태:</strong> {project.status}
          </li>
        </ul>
      </div>

      {/* ✅ 프로젝트 관리 버튼 */}
      {user?.id === project.userId && (
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => router.push(`/projects/${id}/edit`)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            수정
          </button>
          <button onClick={handleDeleteProject} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
            삭제
          </button>
          {project.status !== '마감' && (
            <button
              onClick={handleCloseProject}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
            >
              마감
            </button>
          )}
        </div>
      )}
    </div>
  );
}
