import { Router } from "express";
import { createOrder } from "../../application/commands/createOrder.command";
import { getOrders } from "../../application/queries/getOrders.query";

const router = Router();

// GET /orders
router.get("/", async (req, res, next) => {
  try {
    const orders = await getOrders();
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

// POST /orders
router.post("/", async (req, res, next) => {
  try {
    const order = await createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
});

export default router;
