import  express  from "express";
import { addAddress, getAddresses, updateAddress } from "../controller/addressControlleer.js";
import auth from "../middleware/auth.js";


const addressRouter = express.Router();

addressRouter.get("/", auth, getAddresses);
addressRouter.get("/", auth, addAddress);
addressRouter.get("/:id", auth, updateAddress);
addressRouter.get("/", auth, getAddresses);



export default addressRouter;