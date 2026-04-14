const Product = require('../products/Product');

const lowStock = async(req, res) => {
    try {
        const threshold = Number(req.query.threshold || 5);
        const products = await Product.find({ stock: { $lte: threshold } }).sort({ stock: 1 }).lean();
        return res.json({ ok: true, count: products.length, products });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not fetch low stock items' });
    }
};

const report = async(req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const lowStockCount = await Product.countDocuments({ stock: { $lte: Number(req.query.threshold || 5) } });
        const topLow = await Product.find({ stock: { $lte: Number(req.query.threshold || 5) } }).limit(10).sort({ stock: 1 }).lean();
        return res.json({ ok: true, totalProducts, lowStockCount, topLow });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not build report' });
    }
};

const restock = async(req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body || {};
        if (!id) return res.status(400).json({ message: 'Missing product id' });
        const prod = await Product.findById(id);
        if (!prod) return res.status(404).json({ message: 'Product not found' });
        const newStock = typeof stock !== 'undefined' ? Number(stock) : (prod.stock || 0) + 10;
        prod.stock = newStock;
        await prod.save();
        return res.json({ ok: true, product: prod });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Could not restock' });
    }
};

module.exports = { lowStock, report, restock };