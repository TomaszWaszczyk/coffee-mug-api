import { Schema, model, models } from 'mongoose';

const orderSchema = new Schema({
  customerId: { type: String, required: true },
  location: { type: String, required: true, enum: ['US', 'EU', 'ASIA'] },
  items: [{
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  }],
  total: { type: Number, required: true },
  appliedDiscountType: { type: String, required: true }, // VOLUME, BLACK_FRIDAY, etc.
}, { timestamps: true });

export const OrderModel = models.Order || model('Order', orderSchema);
