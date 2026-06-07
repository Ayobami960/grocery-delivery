import { prisma } from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const getStatusHistory = (statusHistory) => {
    return Array.isArray(statusHistory) ? statusHistory : [];
};
// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id, role: "delivery" }, process.env.JWT_SECRET, { expiresIn: "1d" });
};
// Login delivery partner
// POST /api/delevery/login
export const loginPartner = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Please provide email and password" });
    }
    const partner = await prisma.deliveryPartner.findUnique({ where: {
            email: email.toLowerCase()
        } });
    if (!partner) {
        return res.status(401).json({ message: "Invalid email and password" });
    }
    if (!partner.isActive) {
        return res.status(403).json({ message: "Your account has been deactivated" });
    }
    const isMatch = await bcrypt.compare(password, partner.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email and password" });
    }
    const token = generateToken(partner.id);
    const { password: _, ...partnerData } = partner;
    res.json({ partner: partnerData, token });
};
// Get assigned deliveries
// GET /api/delivery/my-deliveries
export const getMyDeliveries = async (req, res) => {
    const { status } = req.query;
    const where = { deliveryPartnerId: req.partner.id };
    if (status === "active") {
        where.status = { in: ["Assigned", "Packed", "Out for Delivery"] };
    }
    else if (status === "completed") {
        where.status = { in: ["Delivered", "Cancelled"] };
    }
    const orders = await prisma.order.findMany({
        where,
        include: { user: { select: { name: true, email: true, phone: true } } },
        orderBy: { createdAt: "desc" }
    });
    res.json({ orders });
};
// GET single delivery detail
// GET /api/v1/delivery/my-delveries/:id
export const getMyDeliveriesDetail = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, deliveryPartnerId: req.partner.id },
        include: { user: { select: { name: true, email: true, phone: true } } }
    });
    if (!order) {
        return res.status(404).json({ message: "Delivery not found" });
    }
    res.json({ order });
};
// get complete delivery with OTP
// PUT /api/v1/delivery/my-delveries/:id/complete
export const completeDelivery = async (req, res) => {
    const { otp } = req.body;
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, deliveryPartnerId: req.partner.id }
    });
    if (!order) {
        return res.status(404).json({ message: "Delivery not found" });
    }
    if (order.status === "Cancelled" || order.status === "Delivered") {
        return res.status(400).json({ message: "Delivery is already closed" });
    }
    if (!otp || order.deliveryOtp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
    const history = getStatusHistory(order.statusHistory);
    history.push({ status: 'Delivered', note: "Delivered by partner",
        timestamp: new Date()
    });
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "Delivered", statusHistory: history, deliveryOtp: "" }
    });
    res.json({ order: updatedOrder, message: "Delivery completed successfully" });
};
//Cancel delivery
// PUT /api/v1/delivery/my-delveries/:id/cancel
export const cancelDelivery = async (req, res) => {
    const { reason } = req.body;
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, deliveryPartnerId: req.partner.id }
    });
    if (!order) {
        return res.status(404).json({ message: "Delivery not found" });
    }
    if (order.status === "Delivered") {
        return res.status(400).json({ message: "Cannot cancel a delivered order" });
    }
    if (order.status === "Cancelled") {
        return res.status(400).json({ message: "Delivery is already cancelled" });
    }
    const history = getStatusHistory(order.statusHistory);
    history.push({ status: "Cancelled", note: reason || "", timestamp: new Date() });
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status: "Cancelled", statusHistory: history, deliveryOtp: "" }
    });
    res.json({ order: updatedOrder, message: "Delivery cancelled" });
};
// Update order status
// PUT /api/delivery/my-deliveries/:id/status
export const updateDeliveryStatus = async (req, res) => {
    const { status } = req.body;
    const allowedStatuses = ["Packed", "Out for Delivery"];
    if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status update" });
    }
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, deliveryPartnerId: req.partner.id }
    });
    if (!order) {
        return res.status(404).json({ message: "Delivery not found" });
    }
    if (order.status === "Delivered" || order.status === "Cancelled") {
        return res.status(400).json({ message: "Cannot update a closed delivery" });
    }
    if (status === "Packed" && order.status !== "Assigned") {
        return res.status(400).json({ message: "Only assigned deliveries can be marked packed" });
    }
    if (status === "Out for Delivery" && order.status !== "Packed") {
        return res.status(400).json({ message: "Only packed deliveries can be marked out for delivery" });
    }
    const history = getStatusHistory(order.statusHistory);
    history.push({ status, note: `Status updated to ${status}`, timestamp: new Date() });
    const updatedOrder = await prisma.order.update({
        where: { id: order.id },
        data: { status, statusHistory: history }
    });
    res.json({ order: updatedOrder });
};
// Update live location
// PUT /api/delivery/my-deliveries/:id/location
export const updateLocation = async (req, res) => {
    const { lat, lng } = req.body;
    if (typeof lat !== "number" || typeof lng !== "number") {
        return res.status(400).json({ message: "Latitude and longitude are required" });
    }
    const order = await prisma.order.findFirst({
        where: {
            id: req.params.id,
            deliveryPartnerId: req.partner.id,
            status: { in: ['Assigned', "Packed", "Out for Delivery"] }
        }
    });
    if (!order) {
        return res.status(404).json({ message: "Active delivery not found" });
    }
    await prisma.order.update({
        where: { id: order.id },
        data: { liveLocation: { lat, lng, updatedAt: new Date() } }
    });
    res.json({ success: true });
};
//# sourceMappingURL=deliveryPartnerController.js.map