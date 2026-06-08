import  express  from "express";
import authRouter from "./authRoutes.js";
import productRouter from "./productRoutes.js";
import uploadRouter from "./uploadRoutes.js";
import orderRouter from "./orderRoutes.js";
import addressRouter from "./addressRoutes.js";
import adminRouter from "./adminRoutes.js";
import deliveryPatnerRouter from "./deliveryPartnerRoutes.js";
import { prisma } from "../config/db.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);
router.use("/orders", orderRouter);
router.use("/delivery", deliveryPatnerRouter);
router.use("/addresses", addressRouter);
router.use("/admin", adminRouter);

router.get("/health/db", async (req, res) => {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
});



export default router;
