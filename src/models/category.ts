import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true, // Ensure category names are unique
		trim: true,
		lowercase: true,
	},
	description: String,
});

const CategoryModel = mongoose.model("Category", categorySchema);
export default CategoryModel;
