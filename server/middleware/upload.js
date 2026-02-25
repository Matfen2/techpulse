import multer from 'multer';

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'video') {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers vidéo sont acceptés'), false);
    }
  } else if (file.fieldname === 'images') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont acceptés'), false);
    }
  } else {
    cb(null, true);
  }
};

export const uploadListingFiles = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // 100 Mo max (vidéo)
  },
}).fields([
  { name: 'video', maxCount: 1 },
  { name: 'images', maxCount: 5 },
]);