export interface Order {
  id?: string;
  _id?: string;
  status?: string;
  items?: Array<{ productId: string; quantity: number }>;
}
