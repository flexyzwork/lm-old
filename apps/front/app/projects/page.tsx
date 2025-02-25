'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  tags: string[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('API 응답 실패');

        const data: Project[] = await res.json();
        setProjects(data);
      } catch (error) {
        console.error('❌ API 요청 실패:', error);
        setProjects([]); // 더미 데이터 없이 빈 배열 반환
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold text-center dark:text-gray-200">프로젝트 목록</h2>

      {loading && <p className="text-center text-gray-500 dark:text-gray-400 mt-4">로딩 중...</p>}

      {!loading && projects.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 mt-6">
          <p className="text-lg font-semibold">등록된 프로젝트가 없습니다.</p>
          <button
            onClick={() => router.push('/projects/new')}
            className="mt-4 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            새 프로젝트 추가
          </button>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="mt-6 space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="block bg-white dark:bg-gray-800 shadow-md p-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <h3 className="text-lg font-semibold dark:text-gray-200">{project.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
              <p className="text-gray-500 dark:text-gray-300">
                예산: ${project.budget} | 마감일: {project.deadline}
              </p>
              <div className="flex gap-2 mt-2">
                {project.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-lg">
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <button
          onClick={() => router.push('/projects/new')}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          새 프로젝트 추가
        </button>
      </div>
    </div>
  );
}
