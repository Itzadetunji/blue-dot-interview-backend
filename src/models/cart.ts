import mongoose, { Schema } from "mongoose";

const cartSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
		required: true,
		unique: true, // Each user has one cart
	},
	items: [
		{
			product: {
				type: Schema.Types.ObjectId,
				ref: "Product",
			},
			quantity: {
				type: Number,
				required: true,
				min: 1,
			},
		},
	],
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

const CartModel = mongoose.model("Cart", cartSchema);
export default CartModel;
