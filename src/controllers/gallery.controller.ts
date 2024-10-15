import { Request, Response,  } from "express";
import postgresdb from "../config/db";
import { gallerys } from "../models/schema";
import { eq } from "drizzle-orm";

interface AuthenticatedRequest extends Request{
   user : any, 
   files : any
}


export const uploadImage = async (req: AuthenticatedRequest, res: Response) : Promise<any> => {
  try {
      const userId = req.user;
      const existingGallery = await postgresdb.query.gallerys.findFirst({ where: eq(gallerys.userId, userId) });
      
      const images = req.files["images"];
      
      // Create an array of image values
      const imageValues = images.map((image : string) => ({
          imageUrl: image,
          userId: userId
      }));

      // Perform a batch insert
      if (imageValues.length > 0) {
          const upload = await postgresdb.insert(gallerys).values(imageValues).returning({
              imageUrl: gallerys.imageUrl,
              userId: gallerys.userId
          });

          // Respond with the inserted images
          res.status(201).json({ message: 'Images uploaded successfully', images: upload });
      } else {
          res.status(400).json({ message: 'No images to upload' });
      }

  } catch (error: Error | any) {
      res.status(500).json({ message: error.message });
  }
};