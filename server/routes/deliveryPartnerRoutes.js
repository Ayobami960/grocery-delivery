import express from "express";
import { cancelDelivery, completeDelivery, getMyDeliveries, getMyDeliveriesDetail, loginPartner, updateDeliveryStatus, updateLocation } from "../controller/deliveryPartnerController.js";
import deliveryAuth from "../middleware/deliveryAuth.js";
const deliveryPatnerRouter = express.Router();
deliveryPatnerRouter.post('/login', loginPartner);
deliveryPatnerRouter.get('/my-deliveries', deliveryAuth, getMyDeliveries);
deliveryPatnerRouter.get('/my-deliveries/:id', deliveryAuth, getMyDeliveriesDetail);
deliveryPatnerRouter.put('/my-deliveries/:id/complete', deliveryAuth, completeDelivery);
deliveryPatnerRouter.put('/my-deliveries/:id/cancel', deliveryAuth, cancelDelivery);
deliveryPatnerRouter.put('/my-deliveries/:id/status', deliveryAuth, updateDeliveryStatus);
deliveryPatnerRouter.put('/my-deliveries/:id/locaton', deliveryAuth, updateLocation);
export default deliveryPatnerRouter;
//# sourceMappingURL=deliveryPartnerRoutes.js.map