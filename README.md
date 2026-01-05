# Coffee Mug API - Inventory Management System

A RESTful API for managing product inventory with comprehensive order management, dynamic pricing, and discount system. Built with Node.js, Express, and following the CQRS (Command Query Responsibility Segregation) pattern.

# Assumptions

I used one instance of MongoDB (in production should be two instances of database - in two different locations). I have omitted deploying two instances of database due to time constraints.

## Architecture & Design Patterns

```
ARCHITECTURE:
┌─────────────────┐    ┌─────────────────┐
│   Commands      │    │   Queries        │
│ POST/PUT/DELETE │    │     GET          │
│ (Write Model)   │    │ (Read Model)     │
└─────────┬───────┘    └─────────┬───────┘
          │                      │
          └─── MongoDB ───────────┘

```

### CQRS Pattern (Command Query Responsibility Segregation)
- **Commands** (`src/application/commands/`): Handle write operations
  - `createProduct.command.ts` - Product creation
  - `createOrder.command.ts` - Order creation
  - `restockProduct.command.ts` - Stock updates
  - `sellProduct.command.ts` - Inventory reduction
- **Queries** (`src/application/queries/`): Handle read operations
  - `getProducts.query.ts` - Retrieve product list
  - `getOrders.query.ts` - Retrieve order list
- **Assumption**: Complete separation of read and write operations improves scalability and allows independent optimization

# Trade-offs & Alternatives describing:

I wanted to use two instances of PostgreSQL data bases but decided it is too much for proof of concept task. In producion I would use at the beginning two PostgreSQL data bases, and then (if needed) Kafka + Redis.

# Error handling

```
curl -i -X POST http://localhost:3000/api/v1/products   -H "Content-Type: application/json"   -d '{
    "name":"Espresso Mug",
    "description":"Ceramic 300ml",
    "price":29.99,
    "stock":100,
    "category":"muggg"
  }'
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: *
Content-Type: application/json; charset=utf-8
Content-Length: 108
ETag: W/"6c-LNlzEBl+13h0V+GhmlRYdtrGdEQ"
Date: Sun, 04 Jan 2026 02:24:10 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Invalid request payload","details":{"body":["Category must be one of: coffee, mug, accessories"]}}
```

# Test

```
curl -s -X POST http://localhost:3000/api/v1/products/6959d3387218375e4f8b6663/restock   -H "Content-Type: application/json"   -d '{"quantity":10}' | jq -r '.newStock'

```
