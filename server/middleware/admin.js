import { prisma } from "../config/db.js";
const admin = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthenticated" });
        }
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        const adminEmailEnv = process.env.ADMIN_EMAILS ?? process.env.ADMIM_EMAILS;
        const adminEmails = adminEmailEnv ? adminEmailEnv.split(",").map(email => email.trim().toLowerCase()) : [];
        if (!adminEmails.includes(user.email.toLowerCase())) {
            return res.status(403).json({ message: "Access denied, admin only" });
        }
        if (req.user)
            req.user.isAdmin = true;
        next();
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Admin verification failed", error: error.message });
    }
};
export default admin;
//# sourceMappingURL=admin.js.map