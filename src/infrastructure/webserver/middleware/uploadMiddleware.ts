import multer from 'multer';
import path from 'path';

const storage =  multer.memoryStorage()

const fileFilter = (req: any, file: any, cb: any) => {
    console.log("inside upload middleware storage")
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Not an image! Please upload an image.'), false);
    }
};
    

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB limit
    }
});
