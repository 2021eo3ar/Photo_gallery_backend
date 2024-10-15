import { Request, Response } from "express";
import { eq, and } from "drizzle-orm";
import { users } from "../models/schema";
import postgresdb from "../config/db";
import { setUser } from "../config/jwt";
import { bcryptPassword, validatePassword } from "../config/bcrypt";

export const createNewUser = async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;

        const existingUser = await postgresdb.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            throw new Error("user already exists with this email");
        }
        const hashedPass = await bcryptPassword(password);

        const user = await postgresdb
            .insert(users)
            .values({ userName, email, password: hashedPass })
            .returning({ userName: users.userName, email: users.email, password: users.password });
        res.status(201).json({ message: "user created successfully", user });
    } catch (error: any | Error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        console.log(req.body);
        const existingUser = await postgresdb.query.users.findFirst({
            where: eq(users.email, email),
        });
        if (existingUser) {
            console.log("existingUser", existingUser);
            const validation = await validatePassword(password, existingUser.password);
            if (validation) {
                const token = setUser({ userId: existingUser.id });
                res.cookie("token", token);
                res.status(200).json({ message: "login successFull", existingUser });
            } else {
                res.status(400).json({ message: "Invalid password" });
            }
        } else {
            res.status(400).json({ message: "Invalid email or Account not found" });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const logoutUser = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logout Successfull" });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
