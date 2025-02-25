import { diskStorage } from 'multer';
import { extname } from 'path';

const storage = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    callback(null, file.fieldname + '-' + uniqueSuffix + extname(file.originalname));
  },
});

export const multerOptions = {
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // ✅ 50MB 제한
  },
};