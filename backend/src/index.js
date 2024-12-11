import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";
import cors from "cors";
import clientRoutes from "./routes/client.routes.js";
import freelancerRoutes from "./routes/freelancer.routes.js";

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 5000;

// CORS configuration
const corsOptions = {
  origin: [
    "http://localhost:3000", // Next.js default dev server
    "https://trustgigz.vercel.app", // Production domain (replace with actual domain)
    "*", // Be cautious with this in production
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI || "mongodb://localhost:27017/express-mongo-js")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello, Express with JavaScript and MongoDB!");
});

// Routes
app.use("/api/client", clientRoutes);
app.use("/api/freelancer", freelancerRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
