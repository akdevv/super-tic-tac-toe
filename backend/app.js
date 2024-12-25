import express from "express";
import authRoutes from "./src/routes/auth.routes.js";

const app = express();

app.use(express.json());
app.use("/api/auth", authRoutes);

export default app;
