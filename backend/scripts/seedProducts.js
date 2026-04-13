require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../features/products/Product');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/Luxeva';

// Small helper to slugify names consistently
function slugify(name) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Source lists for programmatic generation
const men = [
    'Organic Cotton Tee', 'Linen Relaxed Shirt', 'Cotton Twill Chinos', 'Denim Trucker Jacket',
    'Leather Chelsea Boots', 'Wool Blend Overcoat', 'Merino Crew Sweater', 'Lightweight Bomber Jacket',
    'Classic Oxford Shirt', 'Performance Sweatshorts', 'Textured Polo', 'Tailored Suit Trousers',
    'Herringbone Blazer', 'Quilted Vest', 'Suede Loafers', 'Ribbed Knit Polo'
];

const women = [
    'Silk Bias Cut Midi Skirt', 'Oversized Cashmere Sweater', 'Structured Wool Blazer', 'Pleated Wide-Leg Trousers',
    'Poplin Shirt Dress', 'Silk Slip Dress', 'Tailored Wool Coat', 'Satin Wrap Blouse',
    'Ribbed Midi Dress', 'Chambray Jumpsuit', 'Pleated Mini Skirt', 'Cashmere Cardigan',
    'Asymmetric Tunic', 'Tailored Cigarette Trousers', 'Pleated Maxi Skirt', 'Organza Sleeve Top'
];

const accessories = [
    'Minimalist Leather Tote', 'Merino Wool Scarf', 'Ribbed Knit Beanie', 'Slim Leather Wallet',
    'Canvas Weekender Bag', 'Woven Belt', 'Silk Pocket Square', 'Leather Gloves',
    'Classic Sunglasses', 'Beaded Statement Necklace'
];

function buildVariants(category) {
    if (category === 'men') return { colors: [{ name: 'Black', hex: '#111111' }, { name: 'Navy', hex: '#000080' }], sizes: ['S', 'M', 'L', 'XL'] };
    if (category === 'women') return { colors: [{ name: 'Cream', hex: '#FFFDD0' }, { name: 'Black', hex: '#111111' }], sizes: ['XS', 'S', 'M', 'L'] };
    return { colors: [{ name: 'Tan', hex: '#D2B48C' }], sizes: ['One Size'] };
}

const products = [];

men.forEach((name, i) => {
    products.push({
        name,
        slug: slugify(name),
        price: 2000 + i * 500,
        category: 'men',
        subCategory: i % 3 === 0 ? 'tops' : (i % 3 === 1 ? 'outerwear' : 'trousers'),
        images: [],
        imagesByColor: {
            Black: [],
            Navy: []
        },
        stockByVariant: { Black: { S: 10, M: 15, L: 5, XL: 2 }, Navy: { S: 8, M: 12, L: 4, XL: 1 } },
        description: `${name} — crafted with attention to detail for everyday wear.`,
        variants: buildVariants('men'),
        inStock: true,
        stock: 20 + i
    });
});

women.forEach((name, i) => {
    products.push({
        name,
        slug: slugify(name),
        price: 3000 + i * 600,
        originalPrice: i % 4 === 0 ? (3500 + i * 700) : undefined,
        category: 'women',
        subCategory: i % 3 === 0 ? 'skirts' : (i % 3 === 1 ? 'knitwear' : 'dresses'),
        images: [],
        imagesByColor: {
            Cream: [],
            Black: []
        },
        stockByVariant: { Cream: { XS: 5, S: 10, M: 7, L: 3 }, Black: { XS: 4, S: 8, M: 6, L: 2 } },
        description: `${name} — elevated essentials with a refined finish.`,
        variants: buildVariants('women'),
        isNew: i < 4,
        inStock: true,
        stock: 10 + i
    });
});

accessories.forEach((name, i) => {
    products.push({
        name,
        slug: slugify(name),
        price: 1500 + i * 800,
        category: 'accessories',
        subCategory: i % 2 === 0 ? 'bags' : 'small-leather-goods',
        images: [],
        imagesByColor: { Tan: [] },
        stockByVariant: { Tan: { 'One Size': 30 } },
        description: `${name} — a thoughtful finishing touch to any outfit.`,
        variants: buildVariants('accessories'),
        inStock: true,
        stock: 30
    });
});

// Ensure we have at least 40 products: duplicate pattern if needed
let idx = 1;
while (products.length < 40) {
    const base = products[(idx - 1) % products.length];
    const name = `${base.name} (Edition ${Math.ceil(idx / products.length)})`;
    products.push({
        ...base,
        name,
        slug: slugify(name),
        stock: base.stock + idx
    });
    idx++;
}

async function seed() {
    try {
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to MongoDB for seeding');

        const slugs = products.map(p => p.slug);
        await Product.deleteMany({ slug: { $in: slugs } });

        const created = await Product.insertMany(products);
        console.log(`Inserted ${created.length} products`);
        process.exit(0);
    } catch (err) {
        console.error('Seeding error:', err);
        process.exit(1);
    }
}

seed();