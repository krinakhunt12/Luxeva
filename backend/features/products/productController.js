const Product = require('./Product');
const Image = require('../../models/Image');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const mimeForExt = (ext) => {
    switch (ext.toLowerCase()) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.webp':
            return 'image/webp';
        case '.gif':
            return 'image/gif';
        default:
            return 'application/octet-stream';
    }
};

const PLACEHOLDER = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

const filePathToDataUrl = (imgPath) => {
    try {
        if (!imgPath) return PLACEHOLDER;
        if (String(imgPath).startsWith('data:')) return imgPath; // already a data URL

        // Normalize paths like '/uploads/xxx' or 'uploads/xxx'
        const rel = String(imgPath).replace(/^\//, '');
        const potential = path.join(__dirname, '..', '..', 'public', rel);
        if (!fs.existsSync(potential)) return PLACEHOLDER; // return placeholder if file not present
        const buf = fs.readFileSync(potential);
        const ext = path.extname(potential) || '';
        const mime = mimeForExt(ext);
        return `data:${mime};base64,${buf.toString('base64')}`;
    } catch (err) {
        return PLACEHOLDER;
    }
};

const getProducts = async(req, res) => {
    const { search } = req.query;
    const q = {};
    if (search) q.$or = [{ name: new RegExp(search, 'i') }, { slug: new RegExp(search, 'i') }, { description: new RegExp(search, 'i') }];
    const products = await Product.find(q).lean();

    // Resolve images: they may be data URLs, legacy file paths, or short hashes
    const resolveImage = async(entry) => {
        try {
            if (!entry) return PLACEHOLDER;
            const s = String(entry);
            if (s.startsWith('data:')) return s; // already data URL
            if (s.includes('/')) return filePathToDataUrl(s); // legacy file path
            // treat as short hash; lookup in Image collection
            const img = await Image.findOne({ hash: s }).lean();
            return img && img.dataUrl ? img.dataUrl : PLACEHOLDER;
        } catch (err) {
            return PLACEHOLDER;
        }
    };

    for (const p of products) {
        if (Array.isArray(p.images)) {
            p.images = await Promise.all(p.images.map(resolveImage));
        }
    }

    return res.json(products);
};

const getProductById = async(req, res) => {
    const product = await Product.findById(req.params.id).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (Array.isArray(product.images)) {
        const resolveImage = async(entry) => {
            try {
                if (!entry) return PLACEHOLDER;
                const s = String(entry);
                if (s.startsWith('data:')) return s;
                if (s.includes('/')) return filePathToDataUrl(s);
                const img = await Image.findOne({ hash: s }).lean();
                return img && img.dataUrl ? img.dataUrl : PLACEHOLDER;
            } catch (err) {
                return PLACEHOLDER;
            }
        };
        product.images = await Promise.all(product.images.map(resolveImage));
    }

    return res.json(product);
};

const getProductBySlug = async(req, res) => {
    const product = await Product.findOne({ slug: req.params.slug }).lean();
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (Array.isArray(product.images)) {
        const resolveImage = async(entry) => {
            try {
                if (!entry) return PLACEHOLDER;
                const s = String(entry);
                if (s.startsWith('data:')) return s;
                if (s.includes('/')) return filePathToDataUrl(s);
                const img = await Image.findOne({ hash: s }).lean();
                return img && img.dataUrl ? img.dataUrl : PLACEHOLDER;
            } catch (err) {
                return PLACEHOLDER;
            }
        };
        product.images = await Promise.all(product.images.map(resolveImage));
    }

    return res.json(product);
};

const createProduct = async(req, res) => {
    const payload = req.body || {};

    // If files are uploaded via multer, they will be in req.files as an array.
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const uploadedHashes = [];
        for (const file of req.files) {
            const fileBuffer = file.buffer;
            const dataUrl = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
            // Generate a short random hash for this image
            const genHash = () => crypto.randomBytes(6).toString('hex');
            let hash = genHash();
            // Ensure uniqueness (very small chance of collision)
            while (await Image.findOne({ hash })) {
                hash = genHash();
            }
            const imgDoc = new Image({ hash, mime: file.mimetype, dataUrl });
            await imgDoc.save();
            uploadedHashes.push(hash);
        }
        payload.images = (payload.images || []).concat(uploadedHashes);
    }

    if (!payload.name) return res.status(400).json({ message: 'Missing required field: name' });

    // If a single `image` is provided in JSON, convert to `images` array expected by the model
    if (payload.image && !payload.images) payload.images = [payload.image];

    // Simple slugify helper
    const slugify = (str) => {
        return String(str).toLowerCase().trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
    };

    // Ensure slug exists; generate from name if missing
    let baseSlug = payload.slug ? slugify(payload.slug) : slugify(payload.name);
    let slug = baseSlug;
    let i = 1;
    // Ensure uniqueness by appending a suffix if needed
    while (await Product.findOne({ slug })) {
        slug = `${baseSlug}-${i++}`;
    }
    payload.slug = slug;

    const product = new Product(payload);
    await product.save();
    return res.status(200).json(product);
};

const updateProduct = async(req, res) => {
    const payload = req.body || {};
    // If files uploaded via multer, they will be in req.files as an array.
    if (req.files && Array.isArray(req.files) && req.files.length) {
        const uploadedHashes = [];
        for (const file of req.files) {
            const fileBuffer = file.buffer;
            const dataUrl = `data:${file.mimetype};base64,${fileBuffer.toString('base64')}`;
            const genHash = () => crypto.randomBytes(6).toString('hex');
            let hash = genHash();
            while (await Image.findOne({ hash })) {
                hash = genHash();
            }
            const imgDoc = new Image({ hash, mime: file.mimetype, dataUrl });
            await imgDoc.save();
            uploadedHashes.push(hash);
        }
        payload.images = (payload.images || []).concat(uploadedHashes);
    }
    const product = await Product.findByIdAndUpdate(req.params.id, payload, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
};

const deleteProduct = async(req, res) => {
    const result = await Product.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Product not found' });
    return res.status(200).json({ ok: true });
};

module.exports = { getProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct };