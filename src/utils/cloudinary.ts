import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv';
import multer from 'multer';
import fs from 'fs-extra';
import path from 'path';

dotenv.config();

// Konfigurasi Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Lokasi penyimpanan file secara lokal
const uploadDirectory = path.join(__dirname, '/uploads');

// Konfigurasi multer untuk penyimpanan lokal
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.ensureDirSync(uploadDirectory); // Pastikan direktori upload ada
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Beri nama unik pada file
  }
});

export const upload = multer({ storage: storage });

// Upload file ke penyimpanan lokal
export async function uploadFileLocally(file: any) {
  const localFilePath = path.join(uploadDirectory, file.filename);

  if (!fs.existsSync(localFilePath)) {
    throw new Error('File tidak ditemukan di penyimpanan lokal.');
  }

  return localFilePath;
}

// Unggah file dari penyimpanan lokal ke Cloudinary
export async function uploadFileToCloudinary(localFilePath: string) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(localFilePath, { folder: 'realtimelocation_profile' }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
}

// Mendapatkan URL gambar dari Cloudinary
export async function getImageUrl(publicId: string): Promise<string> {
  return cloudinary.url(publicId, { secure: true });
}
