import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
      },
      quantity: {
        type: Number,
        required: true,
        min: 1, // Ensure quantity is at least 1
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0, // Ensure total is non-negative
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

const OrderModel = mongoose.model('Order', orderSchema);
export default OrderModel;
