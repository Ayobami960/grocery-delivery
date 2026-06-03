import  express  from "express";
import { createOrder, getAllOrders, getOrder, getOrderLocation, getUserOrders } from "../controller/orderController.js";
import auth from "../middleware/auth.js";
import admin from "../middleware/admin.js";
import { updateProduct } from "../controller/productController.js";


const orderRouter = express.Router();

orderRouter.post("/", auth, createOrder);
orderRouter.get("/", auth, getUserOrders);
orderRouter.get("/all", auth, admin, getAllOrders);
orderRouter.get("/:id", auth, getOrder);
orderRouter.put("/:id/status", auth, admin, updateProduct);
orderRouter.get("/:id/location", auth, getOrderLocation);


export default orderRouter;