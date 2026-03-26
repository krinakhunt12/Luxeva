export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subCategory?: string;
  images: string[];
  description: string;
  variants?: {
    colors: { name: string; hex: string }[];
    sizes: string[];
  };
  isNew?: boolean;
  isSale?: boolean;
  inStock?: boolean;
  stock?: number;
  salePrice?: number;
}

export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: 'admin' | 'user';
  createdAt: any;
}

export interface CartItem extends Product {
  selectedColor: string;
  selectedSize: string;
  quantity: number;
}
