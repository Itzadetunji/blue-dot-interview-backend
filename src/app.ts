import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "express";
import { errorHandler } from "./middlewares/errorHandler";
import routes from "./routes";
import connectDB from "./utils/db/connect";

// Load environment variables
dotenv.config();

const app = express();

// DB Connection
connectDB(process.env.DB_CONN_STRING as string);

// Middleware
app.use(helmet());
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", routes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
