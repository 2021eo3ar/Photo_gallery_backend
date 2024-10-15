import { Request, Response, NextFunction } from "express";
import { getUser } from "../config/jwt";

interface AuthenticatedRequest extends Request {
    user?: any; // Adjust the type to whatever `user` should be (e.g., `User`, `DecodedToken`, etc.)
}

export const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const getToken: any = req.cookies.token;
        console.log("getToken", getToken);
        if (!getToken) {
            res.status(400).send({ message: "Token not found" });
            return;
        }
        const user: any = getUser(getToken);
        if (!user) {
            res.status(400).send({ message: "User not Found" });
            return;
        }
        console.log("user", user);
        req.user = user;
        next();
    } catch (err: any) {
        res.status(400).send({ message: err.message });
        return;
    }
};
