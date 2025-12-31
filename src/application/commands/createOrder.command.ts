import { ProductModel } from '../../infrastructure/database/schemas/product.schema';
import { OrderModel } from '../../infrastructure/database/schemas/order.schema';
import { calculateDiscount } from '../../domain/services/discount.service';
import { OrderItem } from '../../domain/services/types';

export interface CreateOrderCommand {
  customerId: string;
  location: 'US' | 'EU' | 'ASIA';
  products: { productId: string; quantity: number }[];
}

export const createOrder = async (cmd: CreateOrderCommand) => {
  // 1. WALIDACJA + POBRANIE PRODUKTÓW (bez sesji)
  const products = await ProductModel.find({
    _id: { $in: cmd.products.map(p => p.productId) }
  });

  if (products.length !== cmd.products.length) {
    throw new Error('Some products not found');
  }

  // 2. WALIDACJA STOCKU + PRZYGOTUJ ITEMS
  const items: OrderItem[] = [];
  let totalQuantity = 0;
  const categories = new Set<string>();

  for (const orderItem of cmd.products) {
    const product = products.find(p => p._id.toString() === orderItem.productId);
    
    if (!product) {
      throw new Error(`Product ${orderItem.productId} not found`);
    }

    if (product.stock < orderItem.quantity) {
      throw new Error(
        `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${orderItem.quantity}`
      );
    }

    // Location pricing (EU +15% VAT, ASIA -5%)
    let unitPrice = product.price;
    if (cmd.location === 'EU') unitPrice *= 1.15;
    else if (cmd.location === 'ASIA') unitPrice *= 0.95;

    const lineTotal = unitPrice * orderItem.quantity;
    items.push({
      productId: product._id.toString(),
      quantity: orderItem.quantity,
      unitPrice,
      lineTotal
    });

    totalQuantity += orderItem.quantity;
    if (product.category) categories.add(product.category);
  }

  // 3. OBLICZ NAJLEPSZY RABAT
  const discount = calculateDiscount(
    totalQuantity,
    Array.from(categories),
    cmd.location,
    new Date()
  );

  // 4. OBLICZ TOTAL PO RABACIE
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal * (1 - discount.discount);

  // 5. ATOMIC BULK UPDATE STOCK + SAVE ORDER
  const bulkOps = cmd.products.map(orderItem => ({
    updateOne: {
      filter: { 
        _id: orderItem.productId,
        stock: { $gte: orderItem.quantity }  // Double-check stock
      },
      update: { 
        $inc: { stock: -orderItem.quantity } 
      }
    }
  }));

  // WYKONAJ ATOMICZNIE wszystkie operacje stocku
  const bulkResult = await ProductModel.bulkWrite(bulkOps, { ordered: true });

  // SPRAWDŹ CZY WSZYSTKIE SIE POWIODŁY
  if (bulkResult.modifiedCount !== cmd.products.length) {
    throw new Error('Failed to update stock for some products (race condition)');
  }

  // 6. ZAPISZ ORDER (już po udanej aktualizacji stocku)
  const newOrder = new OrderModel({
    customerId: cmd.customerId,
    location: cmd.location,
    items,
    total,
    appliedDiscountType: discount.type,
  });
  
  const savedOrder = await newOrder.save();

  return {
    ...savedOrder.toObject(),
    discountPercentage: discount.discount * 100,
    discountType: discount.type
  };
};
