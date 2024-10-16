import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	description: {
		type: String,
		trim: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0, // Ensure price is non-negative
	},
	category: {
		type: Schema.Types.ObjectId,
		ref: "Category",
	},
	image: {
		type: String, // URL or file path to the product image
	},
	totalInStock: {
		type: Number,
		required: true,
		min: 0, // Ensure stock is non-negative
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User", // Reference to the User model
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: Date,
});

const ProductModel = mongoose.model("Product", productSchema);
export default ProductModel;
