import mongoose, { Schema } from "mongoose";

const tokenBlacklistSchema = new Schema({
	token: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date,
		required: true,
	},
});

const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema);
export default TokenBlacklist;
