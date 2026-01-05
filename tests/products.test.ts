import request from "supertest";
import app from "../src/app";

describe("Products API", () => {
  it("should create product", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Espresso Mug",
      description: "Ceramic mug",
      price: 25.99,
      stock: 100,
      category: "mug",
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe("Espresso Mug");
    expect(res.body.price).toBe(25.99);
  });

  it("should get products", async () => {
    const res = await request(app).get("/api/v1/products");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("should return 400 for invalid category", async () => {
    const res = await request(app).post("/api/v1/products").send({
      name: "Weird Item",
      description: "Invalid category",
      price: 9.99,
      stock: 10,
      category: "invalid-category",
    });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    // either Joi message or our explicit BadRequestError message
    expect(typeof res.body.error).toBe("string");
  });
});
