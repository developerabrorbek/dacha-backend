import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const MulterConfig = (uploadDir = './uploads/images', fileSizeMb = 5): MulterOptions => {
  return {
    storage: diskStorage({
      destination: uploadDir,
      filename: (_, file, cb) => {
        const randomName = Array(32)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString(16))
          .join('');
        cb(null, `${randomName}${extname(file.originalname)}`);
      },
      
    }),
    limits: { fileSize: fileSizeMb * 1024 * 1024 }
  };
};
