'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { fetchWithAuth } from '@/lib/auth';
import { usePortfolioStore } from '@/lib/store/portfolioStore';
import TechTagSelector from '@/app/components/TechTagSelector';

export default function EditPortfolioPage() {
  const router = useRouter();
  const { id } = useParams();

  const { title, description, file, tags, setTitle, setDescription, setFile, setTags, reset } = usePortfolioStore();

  const [loading, setLoading] = useState(true);
  const [existingFilePath, setExistingFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (id) fetchPortfolio();
  }, [id]);

  const fetchPortfolio = async () => {
    try {
      const data = await fetchWithAuth(`/api/portfolios/${id}`);
      if (data) {
        setTitle(data.title);
        setDescription(data.description);
        setTags(data.tags || []);
        setExistingFilePath(data.filePath);
      }
    } catch (error) {
      console.error('❌ 포트폴리오 불러오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('tags', JSON.stringify(tags));

      if (file) {
        formData.append('file', file);
      }

      // API 호출: 기존 포트폴리오 업데이트
      await fetchWithAuth(`/api/portfolios/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      alert('포트폴리오가 수정되었습니다.');
      reset(); // 입력값 초기화
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ 포트폴리오 수정 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">포트폴리오 수정</h2>

      {loading ? (
        <p className="text-gray-500">로딩 중...</p>
      ) : (
        <form onSubmit={handleUpdate}>
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

          {/* 기존 이미지 미리보기 */}
          {existingFilePath && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">현재 이미지</p>
              <img src={existingFilePath} alt="포트폴리오 이미지" className="mt-2 rounded-lg shadow-md" />
            </div>
          )}

          {/* 새 파일 업로드 */}
          <label className="block mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
            새 이미지 업로드 (선택 사항)
          </label>
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
            className="w-full mt-2 p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />

          {/* 버튼 그룹 */}
          <div className="mt-6 flex gap-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              disabled={loading}
            >
              {loading ? '저장 중...' : '수정 완료'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              취소
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
