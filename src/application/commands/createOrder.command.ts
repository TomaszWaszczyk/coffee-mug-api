import { ProductModel } from '../../infrastructure/database/schemas/product.schema';
import { OrderModel } from '../../infrastructure/database/schemas/order.schema';
import { calculateDiscount } from '../../domain/services/discount.service';
import { OrderItem } from '../../domain/entities/order.entity';

export interface CreateOrderCommand {
  customerId: string;
  location: 'US' | 'EU' | 'ASIA';
  products: { productId: string; quantity: number }[];
}

export const createOrder = async (cmd: CreateOrderCommand) => {
  const session = await ProductModel.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Pobierz produkty
      const products = await ProductModel.find({
        _id: { $in: cmd.products.map(p => p.productId) }
      }).session(session);

      if (products.length !== cmd.products.length) {
        throw new Error('Some products not found');
      }

      // 2. Sprawdź stock i przygotuj items
      const items: OrderItem[] = [];
      let totalQuantity = 0;
      const categories = new Set<string>();

      for (const orderItem of cmd.products) {
        const product = products.find(p => p._id.toString() === orderItem.productId);
        if (!product) throw new Error(`Product ${orderItem.productId} not found`);

        if (product.stock < orderItem.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        // Location pricing
        let unitPrice = product.price;
        if (cmd.location === 'EU') unitPrice *= 1.15; // +15% VAT
        else if (cmd.location === 'ASIA') unitPrice *= 0.95; // -5%

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

      // 3. Oblicz rabat
      const discount = calculateDiscount(
        totalQuantity,
        Array.from(categories),
        cmd.location,
        new Date()
      );

      const total = items.reduce((sum, item) => sum + item.lineTotal, 0) * (1 - discount.discount);

      // 4. Zapisz zamówienie
      const order = new OrderModel({
        customerId: cmd.customerId,
        location: cmd.location,
        items,
        total,
        appliedDiscountType: discount.type
      });
      await order.save({ session });

      // 5. Zaktualizuj stock
      for (const orderItem of cmd.products) {
        await ProductModel.findByIdAndUpdate(
          orderItem.productId,
          { $inc: { stock: -orderItem.quantity } },
          { session }
        );
      }

      return order;
    });
  } finally {
    await session.endSession();
  }
};
