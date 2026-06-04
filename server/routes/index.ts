import  express  from "express";
import authRouter from "./authRoutes.js";
import productRouter from "./productRoutes.js";
import uploadRouter from "./uploadRoutes.js";
import orderRouter from "./orderRoutes.js";
import addressRouter from "./addressRoutes.js";
import adminRouter from "./adminRoutes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/upload", uploadRouter);
router.use("/order", orderRouter);
router.use("/addresses", addressRouter);
router.use("/admin", adminRouter);



export default router;