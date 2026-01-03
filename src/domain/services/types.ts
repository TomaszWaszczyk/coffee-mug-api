export interface DiscountResult {
  discount: number;  // 0.0 - 1.0 (np. 0.25 = 25%)
  type: 'NONE' | 'VOLUME' | 'BLACK_FRIDAY' | 'HOLIDAY' | 'LOCATION';
}

export interface OrderItem {
  productId: string;     // MongoDB ObjectId as string
  quantity: number;      // min: 1
  unitPrice: number;     // cena po location adjustment (EU +15%, ASIA -5%)
  lineTotal: number;     // unitPrice * quantity
}

export interface CreateOrderInput {
  customerId: string;
  location: 'US' | 'EU' | 'ASIA';
  products: CreateOrderProductInput[];
}

export interface CreateOrderProductInput {
  productId: string;  // MongoDB ObjectId as string
  quantity: number;   // min: 1
}

// Response DTOs (dla API)
export interface OrderResponse {
  id: string;
  customerId: string;
  location: 'US' | 'EU' | 'ASIA';
  items: OrderItem[];
  total: number;
  appliedDiscountType: DiscountResult['type'];
  createdAt: Date;
}

export interface StockUpdateResult {
  productId: string;
  previousStock: number;
  newStock: number;
  quantity: number;  // dodana/odebrana ilość
}

// CQRS Command interfaces
export interface CreateProductCommand {
  name: string;
  description: string;
  price: number;
  stock?: number;
  category?: 'coffee' | 'mug' | 'accessories';
}

export interface RestockCommand {
  productId: string;
  quantity: number;
}

export interface SellCommand {
  productId: string;
  quantity: number;
}
