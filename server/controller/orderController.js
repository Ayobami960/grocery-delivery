import { prisma } from "../config/db.js";
import { inngest } from "../inngest/index.js";
// create order
// POST /api/orders
export const createOrder = async (req, res) => {
    const { items, shippingAddress, paymentMethod } = req.body;
    // check if order items are empty
    if (!items || items.length === 0) {
        return res.status(400).json({ message: "No order items" });
    }
    // Look up actual prices from the database
    const productIds = items.map((i) => i.product);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = {};
    products.forEach((p) => (productMap[p.id] = p));
    // check if product is in stock
    for (const item of items) {
        const product = productMap[item.product];
        if (!product || (productMap[item.product])) {
            return res.status(404).json({
                message: "Product out of stock"
            });
        }
    }
    const orderItems = items.map((item) => {
        const dbProduct = productMap[item.product];
        if (!dbProduct)
            throw new Error(`Product ${item.product} not found`);
        return {
            product: dbProduct.id,
            name: dbProduct.name,
            image: dbProduct.image,
            price: dbProduct.price,
            quantity: item.quantity,
            unit: dbProduct.unit
        };
    });
    const subtotal = orderItems.reduce((sum, item) => sum +
        item.price * item.quantity, 0);
    const deliveryFee = subtotal > 20 ? 0 : 1.99;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;
    const order = await prisma.order.create({
        data: {
            userId: req.user.id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            subtotal,
            deliveryFee,
            tax,
            total,
            statusHistory: [{ status: "Placed", note: "Order placed successfully", timestamp: new Date() }]
        }
    });
    if (paymentMethod === "card") {
        // stripe payment link
    }
    res.json({ order });
    //decrease stock
    for (const item of orderItems) {
        await prisma.product.update({
            where: { id: item.product },
            data: { stock: { decrement: item.quantity } }
        });
    }
    // send stock update events for each product in the order
    for (const item of orderItems) {
        await inngest.send({ name: "inventory/stock.updated", data: { productId: item.product } });
    }
    await inngest.send({ name: "order/placed", data: { orderId: order.id } });
};
// GET  user`s order
// GET /api/orders
export const getUserOrders = async (req, res) => {
    const { status } = req.query;
    const where = {
        userId: req.user.id,
        NOT: [{ PaymentMethod: "card", isPaid: false }]
    };
    if (status && status !== "all") {
        where.status = status;
    }
    const orders = await prisma.order.findMany({
        where,
        include: { deliveryPartner: { select: { name: true, phone: true } } },
        orderBy: { createdAt: "desc" }
    });
    res.json({ orders });
};
// GET single order
// GET /api/orders/:id
export const getOrder = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, userId: req.user.id },
        include: {
            deliveryPartner: {
                select: {
                    name: true, phone: true,
                    avatar: true, vehicleType: true
                }
            }
        }
    });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    res.json({ order });
};
// GET single order
// GET /api/orders/:id
export const updateOrderStatus = async (req, res) => {
    const { status, note } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });
    if (!order) {
        return res.status(404).json({ message: "Order not found" });
    }
    const history = (Array.isArray(order.statusHistory) ? order.statusHistory : []);
    history.push({
        status, note: note || `Order ${status.toLowerCase()}`,
        timeStamp: new Date()
    });
    const updatedOrder = await prisma.order.update({
        where: { id: req.params.id },
        data: { status, statusHistory: history }
    });
    res.json({ order: updatedOrder });
};
// GET all orders (admin)
// GET /api/orders/all
export const getAllOrders = async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { NOT: [{ paymentMethod: "card", isPaid: false }] },
        include: {
            user: { select: { name: true, email: true } },
            deliveryPartner: { select: { name: true, phone: true } }
        },
        orderBy: { createdAt: "desc" }
    });
    res.json({ orders });
};
// GET Order Location
// GET /api/orders/:id/location
export const getOrderLocation = async (req, res) => {
    const order = await prisma.order.findFirst({
        where: { id: req.params.id, userId: req.user.id },
        select: { liveLocation: true, status: true }
    });
    if (!order)
        return res.status(404).json({ message: "Order not found" });
    res.json({ liveLocation: order.liveLocation, status: order.status });
};
//# sourceMappingURL=orderController.js.map