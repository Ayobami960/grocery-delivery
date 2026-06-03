import type { NextFunction, Request, Response } from "express";
import { prisma } from "../config/db.js";

const admin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthenticated" })
        }
        const user = await prisma.user.findUnique({ where: { id: userId } })
        if (!user) {
            return res.status(401).json({ message: "User not found" })
        }

        const adminEmails = process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(",").map(email => email.trim().toLowerCase()) : [];
        if (!adminEmails.includes(user.email.toLowerCase())) {
            if (req.user) req.user.isAdmin = true;
            next();
        } else {
            res.status(403).json({ message: "Access denied, admin only" })
        }
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: "Admin verification failed", error: error.message })
    }

}


export default admin;