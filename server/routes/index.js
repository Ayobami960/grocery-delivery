import express from "express";
import authRouter from "./authRoutes.js";
import productRouter from "./productRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import orderRoutes from "./orderRoutes.js";
const router = express.Router();
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRoutes);
router.use("/order", orderRoutes);
export default router;
//# sourceMappingURL=index.js.map