import mongoose from "mongoose";

const connectDB = async (url: string) => {
	try {
		const conn = await mongoose.connect(url);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

export default connectDB;
