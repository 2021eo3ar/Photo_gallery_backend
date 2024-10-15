import { Request, Response } from "express";
import postgresdb from "../config/db";
import { gallerys } from "../models/schema";
import { eq } from "drizzle-orm";
import { uploadToCloudinary } from "../middlewares/multerConfig";

interface AuthenticatedRequestWithFile extends Request {
    user: any;
    files: any;
}

export const uploadImage: any = async (req: AuthenticatedRequestWithFile, res: Response): Promise<any> => {
    try {
        const user = req.user;

        const images = req.files["images"]
            ? await Promise.all(
                  req.files["images"].map((file: any) => uploadToCloudinary(file.path))
              )
            : [];

        if (!images || images.length === 0) {
            return res.status(400).json({ message: "No images to upload" });
        }

        // Create an array of image values
        const imageValues = images.map((image: string) => ({
            imageUrl: image,
            userId: user.userId,
        }));

        // Perform a batch insert
        const upload = await postgresdb.insert(gallerys).values(imageValues).returning({
            imageUrl: gallerys.imageUrl,
            userId: gallerys.userId,
        });

        // Respond with the inserted images
        return res.status(201).json({ message: "Images uploaded successfully", images: upload });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};


interface AuthenticatedRequest extends Request {
    user: any;
}

export const getImagesByUserId: any = async (
    req: AuthenticatedRequest,
    res: Response
): Promise<any> => {
    try {
        const user = req.user;

        // Fetch images where the userId matches the logged-in user's ID
        const images = await postgresdb
            .select()
            .from(gallerys)
            .where(eq(gallerys.userId, user.userId));

        if (!images || images.length === 0) {
            return res.status(404).json({ message: "No images found for this user" });
        }

        // Respond with the fetched images
        return res.status(200).json({ message: "Images fetched successfully", images });
    } catch (error: any) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
};