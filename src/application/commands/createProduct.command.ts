import { ProductModel } from '../../infrastructure/database/schemas/product.schema';
import { CreateProductCommand } from '../../domain/services/types';

export const createProduct = async (cmd: CreateProductCommand) => {
  const product = new ProductModel({
    ...cmd,
    stock: cmd.stock || 0
  });
  
  const saved = await product.save();
  return saved;
};
