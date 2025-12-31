import { ProductModel } from '../../infrastructure/database/schemas/product.schema';

export const getProducts = async () => {
  return await ProductModel.find().sort({ createdAt: -1 });
};
