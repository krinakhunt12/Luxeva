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
