import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
    console.log("inside upload middleware storage");
    
    // Allowed MIME types for passport photos
    const allowedMimetypes = ['image/jpeg', 'image/png'];
    
    // Allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    
    // Check MIME type
    if (!allowedMimetypes.includes(file.mimetype)) {
        return cb(new Error('Invalid image format. Only JPG, JPEG, and PNG are allowed.'), false);
    }
    
    // Check file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
        return cb(new Error('Invalid file extension. Only .jpg, .jpeg, and .png are allowed.'), false);
    }
    
    cb(null, true);
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 300 * 1024 // 300 KB max limit for initial upload
    }
});
