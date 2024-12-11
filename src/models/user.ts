import mongoose, { Document, Schema } from "mongoose";

// Interface for the User document
interface IUser extends Document {
	fullName: string;
	email: string;
	password: string;
}

// Create the User schema
const UserSchema: Schema<IUser> = new mongoose.Schema({
	fullName: {
		type: String,
		required: [true, "Please provide full name"],
		minlength: 3,
		maxlength: 100,
	},
	email: {
		type: String,
		required: [true, "Please provide an email"],
		unique: true,
		match: [
			/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			"Please provide a valid email",
		],
	},
	password: {
		type: String,
		required: [true, "Please provide a password"],
		minlength: 6,
	},
});

// Export the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
