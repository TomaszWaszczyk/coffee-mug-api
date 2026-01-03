import { Router } from "express";
import { createOrder } from "../../application/commands/createOrder.command";
import { getOrders } from "../../application/queries/getOrders.query";

const router = Router();

// GET /orders
router.get("/", async (req, res) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

// POST /orders
router.post("/", async (req, res) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;
