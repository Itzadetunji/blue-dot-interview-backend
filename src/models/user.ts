import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Interface for the User document
interface IUser extends Document {
	fullName: string;
	email: string;
	password: string;

	createJWT(): string;
	comparePassword(candidatePassword: string): Promise<boolean>;
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

// Pre-save middleware to hash the password before saving it
UserSchema.pre("save", async function (next) {
	const user = this as IUser;
	if (!user.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	next();
});

// Method to create a JWT token
UserSchema.methods.createJWT = function (): string {
	return jwt.sign(
		{
			userId: this._id,
			email: this.email,
		},
		process.env.JWT_SECRET as string,
		{
			expiresIn: "30d",
		}
	);
};

// Method to compare the input password with the hashed password in the database
UserSchema.methods.comparePassword = async function (
	candidatePassword: string
): Promise<boolean> {
	return bcrypt.compare(candidatePassword, this.password);
};

// Export the User model
const User = mongoose.model<IUser>("User", UserSchema);

export default User;
