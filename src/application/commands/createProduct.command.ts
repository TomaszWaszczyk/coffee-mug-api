import { ProductModel } from "../../infrastructure/database/schemas/product.schema";
import { CreateProductCommand } from "../../domain/services/types";
import { BadRequestError } from "../../middleware/errors";

const ALLOWED_CATEGORIES = ["coffee", "mug", "accessories"];

export const createProduct = async (cmd: CreateProductCommand) => {
  if (cmd.category && !ALLOWED_CATEGORIES.includes(cmd.category)) {
    throw new BadRequestError(
      `Invalid category. Allowed: ${ALLOWED_CATEGORIES.join(", ")}`
    );
  }

  const product = new ProductModel({
    ...cmd,
    stock: cmd.stock || 0,
  });

  const saved = await product.save();
  return saved;
};
