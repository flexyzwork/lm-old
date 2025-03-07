import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/videos', // ✅ 저장 경로
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + extname(file.originalname)); // ✅ 파일명 설정
    },
  }),
  fileFilter: (req: any, file: { mimetype: string; }, cb: (arg0: Error | null, arg1: boolean) => void) => {
    if (!file.mimetype.startsWith('video/')) {
      return cb(new Error('Only video files are allowed'), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 100 * 1024 * 1024 }, // ✅ 최대 100MB 제한
};
