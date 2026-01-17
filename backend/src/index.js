import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import placesRouter from "./routes/places.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("GoWhere backend running ✅");
});

// Routes
app.use("/api/places", placesRouter);

// Test AI service connection
app.get("/api/ai-test", async (req, res) => {
  try {
    // Dynamically import node-fetch if not available globally
    const fetch = (await import('node-fetch')).default;
    const aiServiceUrl = "http://localhost:8008/"; // AI service health check endpoint
    const response = await fetch(aiServiceUrl);
    const data = await response.json();

    if (response.ok) {
      res.status(200).json({
        message: "Successfully connected to AI Service",
        aiServiceResponse: data,
      });
    } else {
      res.status(response.status).json({
        message: "AI Service returned an error",
        aiServiceResponse: data,
      });
    }
  } catch (error) {
    console.error("Error connecting to AI Service:", error);
    res.status(500).json({
      message: "Failed to connect to AI Service",
      error: error.message,
    });
  }
});

// Server
const PORT = Number(process.env.PORT) || 5001;
app.listen(PORT, () => {
  console.log(`✅ Backend listening on http://localhost:${PORT}`);
});
