import { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  name: { type: String, required: true, maxlength: 50 },
  description: { type: String, required: true, maxlength: 50 },
  price: { type: Number, required: true, min: 0.01 },
  stock: { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, enum: ['coffee', 'mug', 'accessories'] }, // dla holiday sales
}, { 
  timestamps: true 
});

export const ProductModel = models.Product || model('Product', productSchema);
