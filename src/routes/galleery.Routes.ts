import {Router} from "express"
import { AuthenticateUser } from "../middlewares/authMiddleware";
import { uploadImage } from "../controllers/gallery.controller";


const galleryRouter = Router();

galleryRouter.post("/uploadImages", uploadImage )

export default galleryRouter