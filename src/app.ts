import express from "express";
import cors from "cors";
import { connectDb } from "./infrastructure/database/mongoose";
import productsRouter from "./interfaces/controllers/products.controller";
import ordersRouter from "./interfaces/controllers/orders.controller";
import errorHandler from "./middleware/errorHandler";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/v1/products", productsRouter);
app.use("/api/v1/orders", ordersRouter);

app.use(errorHandler);

export const start = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== "test") {
  start();
}

export default app;
