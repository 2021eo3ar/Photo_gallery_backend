import express, { Request, Response } from "express";
import dotenv from "dotenv"
// import checkauth from "./controllers/user.controller";
// import protect from "./middlewares/authmiddleware";
// import userRoutes from "./routes/user.Routes";
import cors from "cors"
import cookieParser from 'cookie-parser';
import router from "./routes/user.Routes";
import galleryRouter from "./routes/galleery.Routes"


dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(cors())
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TypeScript backend!");
});

app.use("/api/user", router)
app.use("/api/user", galleryRouter)



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
