import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json, urlencoded } from "express";
import helmet from "helmet";
import errorHandler from "./middlewares/errorHandler";
import v1Routes from "./routes/v1";
import connectDB from "./utils/db/connect";

// Load environment variables
dotenv.config();

const app = express();

// DB Connection
connectDB(process.env.DB_CONN_STRING as string);

// Middleware
app.use(helmet());
app.use(cors({ credentials: true, origin: true }));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes v1
app.use("/api", v1Routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
