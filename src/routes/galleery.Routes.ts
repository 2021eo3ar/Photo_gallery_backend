import { Router } from "express";
import { authenticateUser } from "../middlewares/authMiddleware";
import { upload } from "../middlewares/multerConfig";
import { getImagesByUserId, uploadImage } from "../controllers/gallery.controller";

const galleryRouter = Router();

galleryRouter.post(
    "/uploadImages",
    authenticateUser,
    upload.fields([{ name: "images", maxCount: 20 }]),
    uploadImage
);

galleryRouter.get("/", authenticateUser, getImagesByUserId);

export default galleryRouter;
