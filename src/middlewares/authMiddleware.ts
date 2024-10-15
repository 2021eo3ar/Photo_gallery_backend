import { NextFunction, Request, Response } from "express";
import { getUser } from "../config/jwt";

interface CookieRequest extends Request {
    cookiesreturn: { [key: string]: string | undefined }; // Define a more specific type for cookies
    user?: any; // Optional user property
}

export const AuthenticateUser = async (req: CookieRequest, res: Response, next: NextFunction) : Promise<void> => {
    try {
        const token = req.cookies.token;

        // Check if the token exists
        if (!token) {
           res.status(401).json({ message: "Unauthorized User" });
        }

        // Validate the token and get the user
        const user = await getUser(token);
        
        // Check if the user is valid
        if (!user) {
             res.status(401).json({ message: "Invalid user" });
        }

        // Attach the user to the request object
        req.user = user;
        next();
    } catch (error: any) {
        console.error("Authentication error:", error); // Log the error for debugging
         res.status(500).json({ message: "Internal Server Error" });
    }
};
