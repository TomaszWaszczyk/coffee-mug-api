import { Router } from "express";
import {
  createProduct,
  restockProduct,
  sellProduct,
} from "../../application/commands/";
import { getProducts } from "../../application/queries/getProducts.query";
import {
  productValidation,
  restockValidation,
  sellValidation,
} from "../../infrastructure/validation/schemas";

const router = Router();

// GET /products
router.get("/", async (req, res, next) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

// POST /products
router.post("/", productValidation, async (req, res, next) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

// POST /products/:id/restock
router.post("/:id/restock", restockValidation, async (req, res, next) => {
  try {
    const result = await restockProduct(req.params.id, req.body.quantity);
    res.json({ newStock: result.newStock });
  } catch (error) {
    next(error);
  }
});

// POST /products/:id/sell
router.post("/:id/sell", sellValidation, async (req, res, next) => {
  try {
    const result = await sellProduct(req.params.id, req.body.quantity);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
