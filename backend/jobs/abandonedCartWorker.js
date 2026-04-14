const cron = require('node-cron');
const AbandonedCart = require('../features/abandoned/AbandonedCart');
const nodemailer = require('nodemailer');

function createTransporter() {
    if (process.env.SMTP_HOST && process.env.SMTP_USER) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT || 587),
            secure: !!process.env.SMTP_SECURE,
            auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        });
    }
    // fallback - logs
    return { sendMail: async(opts) => { return Promise.resolve(); } };
}

const transporter = createTransporter();

// run every hour
cron.schedule('0 * * * *', async() => {
    try {
        const cutoff = new Date(Date.now() - 1000 * 60 * 60 * 24); // 24h
        const carts = await AbandonedCart.find({ recovered: false, notifiedAt: { $exists: false }, lastUpdated: { $lte: cutoff } }).limit(200).lean();
        for (const c of carts) {
            if (!c.email) continue; // need email to send
            const url = `${process.env.APP_URL || 'http://localhost:3000'}/wishlists/${c.token}`;
            const html = `<p>We saved your cart. Complete your purchase: <a href="${url}">Resume Purchase</a></p>`;
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || 'noreply@luxeva.test',
                to: c.email,
                subject: 'You left items in your bag',
                html
            });
            await AbandonedCart.updateOne({ _id: c._id }, { notifiedAt: new Date() });
        }
    } catch (err) {
        console.error('Abandoned worker error', err);
    }
});

module.exports = { startAbandonedWorker: () => { /* cron started on import */ } };