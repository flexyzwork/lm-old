'use server';
// import { fetchWithAuth } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function uploadPortfolio(formData: FormData) {
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const tags = JSON.parse(formData.get('tags') as string);
  const file = formData.get('file') as File;

  if (!file) throw new Error('파일이 없습니다.');

  // 이미지 저장 경로
  const filePath = path.join(process.cwd(), 'public/uploads', file.name);
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  await writeFile(filePath, fileBuffer);

  // 🚀 실제로는 DB 저장 (예: Prisma 사용)
  console.log('포트폴리오 저장:', { title, description, tags, filePath });
  // await fetchWithAuth('/api/portfolios', {
  //   method: 'POST',
  //   body: JSON.stringify({ title, description, tags, filePath }),
  // });

  return { filePath };
}
