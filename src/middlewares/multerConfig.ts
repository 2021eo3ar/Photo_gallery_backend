import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig";

const allowedFileTypes: string[] = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
    "image/avif",
];

const storage: StorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const fileFilter = (
    req: Express.Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
) => {
    if (allowedFileTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error("Invalid file type. Only JPEG, JPG, PNG, WebP, and AVIF are allowed.") as any,
            false
        );
    }
};

const upload = multer({ storage, fileFilter });

const uploadToCloudinary = (localFilePath: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            localFilePath,
            { folder: "pet_images" },
            (error: any, result: any) => {
                if (error) {
                    reject(error);
                } else {
                    fs.unlinkSync(localFilePath);
                    resolve(result.secure_url);
                }
            }
        );
    });
};

export { upload, uploadToCloudinary };
