import cors from "cors";
import express from "express";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

const corsOptions = {
	origin: [process.env.FRONTEND_URL || "http://localhost:3000"],
	credentials: true,
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());

// ROUTES
app.use("/api/auth", authRoutes);

export default app;
