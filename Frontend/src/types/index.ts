export interface Product {
  _id?: string;
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  imagesByColor?: Record<string, string[]>;
  // optional stock per color and size: { [colorName]: { [size]: number } }
  stockByVariant?: Record<string, Record<string, number>>;
  description: string;
  variants?: {
    colors: { name: string; hex: string }[];
    sizes: string[];
  };
  isNewArrival?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  stock?: number;
  salePrice?: number;
}

export interface User {
  uid: string;
  id?: string;
  email: string;
  name?: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  mobile?: string;
  role?: 'admin' | 'user';
  createdAt: any;
}

export interface CartItem extends Product {
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}
