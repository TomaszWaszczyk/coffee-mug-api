import { Router } from 'express';
import { createProduct, restockProduct, sellProduct } from '../../application/commands';
import { getProducts } from '../../application/queries/getProducts.query'; 
import { productValidation, restockValidation, sellValidation } from '../../infrastructure/validation/schemas';

const router = Router();

// GET /products
router.get('/', async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /products
router.post('/', productValidation, async (req, res) => {
  try {
    const product = await createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// POST /products/:id/restock
router.post('/:id/restock', restockValidation, async (req, res) => {
  try {
    const result = await restockProduct(req.params.id, req.body.quantity);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// POST /products/:id/sell
router.post('/:id/sell', sellValidation, async (req, res) => {
  try {
    const result = await sellProduct(req.params.id, req.body.quantity);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
