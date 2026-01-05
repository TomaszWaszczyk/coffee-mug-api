import { OrderModel } from '../../infrastructure/database/schemas/order.schema';

export const getOrders = async () => {
  return await OrderModel.find()
    .populate('items.productId', 'name price')
    .sort({ createdAt: -1 });
};
