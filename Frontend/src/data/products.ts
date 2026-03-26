import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Silk Bias Cut Midi Skirt',
    slug: 'silk-bias-cut-midi-skirt',
    price: 4500,
    originalPrice: 6000,
    category: 'women',
    subCategory: 'skirts',
    images: [
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'A timeless bias-cut skirt crafted from 100% mulberry silk. Features a subtle sheen and a fluid drape that moves beautifully with every step.',
    variants: {
      colors: [
        { name: 'Champagne', hex: '#F7E7CE' },
        { name: 'Black', hex: '#111111' },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    isSale: true,
    inStock: true,
  },
  {
    id: '2',
    name: 'Oversized Cashmere Sweater',
    slug: 'oversized-cashmere-sweater',
    price: 8900,
    category: 'women',
    subCategory: 'knitwear',
    images: [
      'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Luxuriously soft oversized sweater made from premium Grade-A cashmere. Designed for a relaxed fit with dropped shoulders and ribbed trims.',
    variants: {
      colors: [
        { name: 'Oatmeal', hex: '#E5D3B3' },
        { name: 'Charcoal', hex: '#36454F' },
      ],
      sizes: ['S', 'M', 'L'],
    },
    isNew: true,
    inStock: true,
  },
  {
    id: '3',
    name: 'Structured Wool Blazer',
    slug: 'structured-wool-blazer',
    price: 12500,
    category: 'women',
    subCategory: 'outerwear',
    images: [
      'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'A sharp, structured blazer tailored from Italian wool blend. Features peak lapels, padded shoulders, and a double-breasted front.',
    variants: {
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Navy', hex: '#000080' },
      ],
      sizes: ['34', '36', '38', '40'],
    },
    inStock: true,
  },
  {
    id: '4',
    name: 'Linen Relaxed Shirt',
    slug: 'linen-relaxed-shirt',
    price: 3200,
    category: 'men',
    subCategory: 'shirts',
    images: [
      'https://images.unsplash.com/photo-1594932224491-ef243e7a7c98?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594932224491-ef243e7a7c98?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Breathable linen shirt with a relaxed fit. Perfect for warm days, featuring a classic collar and sustainable pearl buttons.',
    variants: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Sage', hex: '#9CAF88' },
      ],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    inStock: true,
  },
  {
    id: '5',
    name: 'Minimalist Leather Tote',
    slug: 'minimalist-leather-tote',
    price: 15000,
    category: 'accessories',
    subCategory: 'bags',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Handcrafted from vegetable-tanned leather, this spacious tote features a clean silhouette and an internal pocket for essentials.',
    variants: {
      colors: [
        { name: 'Tan', hex: '#D2B48C' },
        { name: 'Black', hex: '#111111' },
      ],
      sizes: ['One Size'],
    },
    inStock: true,
  },
  {
    id: '6',
    name: 'Cotton Twill Chinos',
    slug: 'cotton-twill-chinos',
    price: 4200,
    category: 'men',
    subCategory: 'trousers',
    images: [
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Slim-fit chinos made from organic cotton twill with a touch of stretch for comfort. Garment-dyed for a soft, lived-in feel.',
    variants: {
      colors: [
        { name: 'Olive', hex: '#556B2F' },
        { name: 'Navy', hex: '#000080' },
      ],
      sizes: ['30', '32', '34', '36'],
    },
    inStock: true,
  },
  {
    id: '7',
    name: 'Pleated Wide-Leg Trousers',
    slug: 'pleated-wide-leg-trousers',
    price: 5800,
    category: 'women',
    subCategory: 'trousers',
    images: [
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Elegant wide-leg trousers with sharp front pleats. Crafted from a high-quality crepe fabric that resists wrinkling.',
    variants: {
      colors: [
        { name: 'Cream', hex: '#FFFDD0' },
        { name: 'Black', hex: '#111111' },
      ],
      sizes: ['XS', 'S', 'M', 'L'],
    },
    inStock: true,
  },
  {
    id: '8',
    name: 'Merino Wool Scarf',
    slug: 'merino-wool-scarf',
    price: 2500,
    category: 'accessories',
    subCategory: 'scarves',
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Extra-fine merino wool scarf, lightweight yet incredibly warm. Finished with delicate fringe edges.',
    variants: {
      colors: [
        { name: 'Grey', hex: '#808080' },
        { name: 'Camel', hex: '#C19A6B' },
      ],
      sizes: ['One Size'],
    },
    inStock: true,
  },
  {
    id: '9',
    name: 'Poplin Shirt Dress',
    slug: 'poplin-shirt-dress',
    price: 6500,
    category: 'women',
    subCategory: 'dresses',
    images: [
      'https://images.unsplash.com/photo-1539008835657-9e8e968000a7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1539008835657-9e8e968000a7?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'A modern take on the classic shirt dress, made from crisp cotton poplin. Features a detachable belt to define the waist.',
    variants: {
      colors: [
        { name: 'White', hex: '#FFFFFF' },
        { name: 'Blue Stripe', hex: '#ADD8E6' },
      ],
      sizes: ['S', 'M', 'L'],
    },
    inStock: true,
  },
  {
    id: '10',
    name: 'Leather Chelsea Boots',
    slug: 'leather-chelsea-boots',
    price: 11000,
    category: 'men',
    subCategory: 'shoes',
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'Classic Chelsea boots crafted from premium Italian leather. Features elasticated side panels and a durable rubber sole.',
    variants: {
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Dark Brown', hex: '#3D2B1F' },
      ],
      sizes: ['41', '42', '43', '44'],
    },
    inStock: true,
  },
  {
    id: '11',
    name: 'Ribbed Knit Beanie',
    slug: 'ribbed-knit-beanie',
    price: 1800,
    category: 'accessories',
    subCategory: 'hats',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48dace7a7?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1576871337622-98d48dace7a7?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'A cozy ribbed beanie made from a soft wool-mohair blend. Perfect for cold winter days.',
    variants: {
      colors: [
        { name: 'Beige', hex: '#F5F5DC' },
        { name: 'Black', hex: '#111111' },
      ],
      sizes: ['One Size'],
    },
    inStock: true,
  },
  {
    id: '12',
    name: 'Denim Trucker Jacket',
    slug: 'denim-trucker-jacket',
    price: 7500,
    category: 'men',
    subCategory: 'outerwear',
    images: [
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?q=80&w=1000&auto=format&fit=crop&blur=10',
    ],
    description: 'A rugged denim jacket made from heavy-duty raw denim. Will develop a unique patina over time.',
    variants: {
      colors: [
        { name: 'Indigo', hex: '#00416A' },
      ],
      sizes: ['M', 'L', 'XL'],
    },
    inStock: false,
  }
];
