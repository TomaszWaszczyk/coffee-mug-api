import { ProductModel } from "../../infrastructure/database/schemas/product.schema";
import { StockUpdateResult } from "../../domain/services/types";

export const restockProduct = async (
  productId: string,
  quantity: number
): Promise<StockUpdateResult> => {
  const product = await ProductModel.findById(productId);

  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  const previousStock = product.stock;
  product.stock += quantity;
  await product.save();

  return {
    productId,
    previousStock,
    newStock: product.stock,
    quantity: quantity,
  };
};
