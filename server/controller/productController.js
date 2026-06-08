import { prisma } from "../config/db.js";
// get /api/v1/products/flasj-deals
export const getFlashDeals = async (req, res) => {
    const products = await prisma.product.findMany({
        where: { stock: { gt: 0 } },
        orderBy: { originalPrice: "desc" }
    });
    const productsWithDiscount = products.map((p) => {
        const discount = p.originalPrice && p.price ?
            Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });
    res.json({ products: productsWithDiscount.slice(0, 8) });
};
// GET /api/v1/products
export const getProducts = async (req, res) => {
    const { category, search, minPrice, maxPrice, sort, organic } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 50);
    const skip = (page - 1) * limit;
    const where = {};
    if (category && category !== "all")
        where.category = category;
    if (search)
        where.name = { contains: search, mode: "insensitive" };
    if (organic === "true")
        where.isOrganic = true;
    if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice)
            where.price.gte = Number(minPrice);
        if (maxPrice)
            where.price.lte = Number(maxPrice);
    }
    const orderBy = {};
    if (sort === "price-low")
        orderBy.price = 'asc';
    else if (sort === "price-high")
        orderBy.price = 'desc';
    else if (sort === "rating")
        orderBy.rating = 'desc';
    else if (sort === "name")
        orderBy.name = 'asc';
    else
        orderBy.createdAt = 'desc';
    const [products, total] = await Promise.all([
        prisma.product.findMany({ where, orderBy, skip, take: limit }),
        prisma.product.count({ where })
    ]);
    const productsWithDiscount = products.map((p) => {
        const discount = p.originalPrice && p.price ? Math.round(((p.
            originalPrice - p.price) / p.originalPrice) * 100) : 0;
        return { ...p, discount };
    });
    res.json({ products: productsWithDiscount, page, pages: Math.ceil(total / limit), total });
};
// GET /api/product/:id
export const getProduct = async (req, res) => {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
    }
    const discount = product.originalPrice && product.price ?
        Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;
    res.json({ ...product, discount });
};
// POST /api/v1/products
export const createProduct = async (req, res) => {
    const product = await prisma.product.create({ data: req.body });
    res.status(201).json(product);
};
// PUT /api/products/:id
export const updateProduct = async (req, res) => {
    const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json({ product });
};
// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
    await prisma.product.update({ where: { id: req.params.id }, data: { stock: 0 } });
    res.json({ message: "Product marked as out of stock" });
};
//# sourceMappingURL=productController.js.map