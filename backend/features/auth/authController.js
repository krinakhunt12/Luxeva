const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../user/User');

const signup = async(req, res) => {
    try {
        const { name, email, mobile, password } = req.body || {};
        if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(400).json({ message: 'Email already in use' });
        const hashed = bcrypt.hashSync(password, 10);
        const user = new User({ name, email: email.toLowerCase(), mobile, password: hashed });
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'luxeva_secret', { expiresIn: '7d' });
        const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role };
        return res.json({ user: safeUser, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const login = async(req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: 'Invalid email or password' });
        const match = bcrypt.compareSync(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid email or password' });
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'luxeva_secret', { expiresIn: '7d' });
        const safeUser = { id: user._id, name: user.name, email: user.email, mobile: user.mobile, role: user.role };
        return res.json({ user: safeUser, token });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const { OAuth2Client } = require('google-auth-library');

const googleAuth = async(req, res) => {
    try {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/google/callback`;
        if (!clientId) return res.status(500).json({ message: 'Google client ID not configured' });
        const params = new URLSearchParams({
            client_id: clientId,
            redirect_uri: redirectUri,
            response_type: 'code',
            scope: 'openid email profile',
            access_type: 'offline',
            prompt: 'select_account'
        });
        const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
        return res.redirect(url);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Google auth redirect failed' });
    }
};

const googleCallback = async(req, res) => {
    try {
        const code = req.query.code;
        if (!code) return res.status(400).json({ message: 'Missing code' });
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${req.protocol}://${req.get('host')}/api/google/callback`;
        if (!clientId || !clientSecret) return res.status(500).json({ message: 'Google OAuth secrets not configured' });

        const client = new OAuth2Client(clientId, clientSecret, redirectUri);
        const { tokens } = await client.getToken(String(code));
        const idToken = tokens.id_token;
        if (!idToken) return res.status(400).json({ message: 'No id_token received' });

        const ticket = await client.verifyIdToken({ idToken, audience: clientId });
        const payload = ticket.getPayload();
        if (!payload) return res.status(400).json({ message: 'Invalid id token' });

        const email = (payload.email || '').toLowerCase();
        const name = payload.name || '';
        const picture = payload.picture;

        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ name, email, password: '', avatar: picture });
            await user.save();
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'luxeva_secret', { expiresIn: '7d' });

        // Redirect back to app with token in query param (frontend should read and store it).
        const redirectTo = (process.env.APP_URL || 'http://localhost:5173') + `/auth/success?token=${token}`;
        return res.redirect(redirectTo);
    } catch (err) {
        console.error('Google callback error', err);
        return res.status(500).json({ message: 'Google callback failed' });
    }
};

module.exports = { signup, login };
module.exports.googleAuth = googleAuth;
module.exports.googleCallback = googleCallback;