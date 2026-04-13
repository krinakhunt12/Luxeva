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

module.exports = { lowStock, report };