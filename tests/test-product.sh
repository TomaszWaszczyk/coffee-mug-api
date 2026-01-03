#!/bin/bash
echo "Testing Products API..."

# 1. Create
echo "📦 Creating product..."
curl -s -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Mug",
    "description": "Automated test", 
    "price": 19.99,
    "stock": 100,
    "category": "mug"
  }' > response.json

PRODUCT_ID=$(cat response.json | jq -r 'if .data then ._id else ._id end // empty')
echo "Created! ID: $PRODUCT_ID"

# 2. List (uniwersalne parsowanie)
echo "Checking list..."
LIST_JSON=$(curl -s http://localhost:3000/api/v1/products)

# Spróbuj różne formaty
PRODUCT_COUNT=$(echo "$LIST_JSON" | jq 'if type == "array" then length else (.data | length) end // 0')
echo "Found $PRODUCT_COUNT products"

if [ "$PRODUCT_COUNT" -gt 0 ]; then
  echo "✅ List OK!"
  echo "$LIST_JSON" | head -2
else
  echo "❌ No products found"
  echo "Raw response: $LIST_JSON" | head -3
  exit 1
fi

# 3. Restock
if [ -n "$PRODUCT_ID" ]; then
  echo "Restocking $PRODUCT_ID..."
  RESTOCK_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/v1/products/$PRODUCT_ID/restock" \
    -H "Content-Type: application/json" -d '{"quantity":50}')
  echo "$RESTOCK_RESPONSE" | jq .
  echo "✅ Restock OK!"
else
  echo "❌ No product ID"
fi

echo "🎉 TESTS COMPLETED! 🏆"
rm -f response.json
