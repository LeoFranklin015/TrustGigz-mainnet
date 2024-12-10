import express, { json } from "express";
import { connect } from "mongoose";
import { config } from "dotenv";

// Load environment variables from .env file
config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI || "mongodb://localhost:27017/express-mongo-js", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Example route
app.get("/", (req, res) => {
  res.send("Hello, Express with JavaScript and MongoDB!");
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
