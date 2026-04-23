const Order = require('../orders/Order');
const Product = require('../products/Product');
const User = require('../user/User');

const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const orders = await Order.find({ status: { $ne: 'cancelled' } });
        
        const totalOrders = orders.length;
        const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

        // Revenue trend data (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            d.setHours(0, 0, 0, 0);
            return d;
        }).reverse();

        const revenueTrend = await Promise.all(last7Days.map(async (date) => {
            const nextDay = new Date(date);
            nextDay.setDate(nextDay.getDate() + 1);
            
            const dayOrders = await Order.find({
                createdAt: { $gte: date, $lt: nextDay },
                status: { $ne: 'cancelled' }
            });
            
            return {
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                revenue: dayOrders.reduce((sum, o) => sum + (o.total || 0), 0)
            };
        }));

        return res.json({
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue
            },
            revenueTrend
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getRecentOrders = async (req, res) => {
    try {
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();
        return res.json(recentOrders);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardStats, getRecentOrders };
