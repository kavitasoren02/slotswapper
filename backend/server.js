const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ quiet: true }); // hide dotenv logs

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

//MongoDB Connection (no deprecated options)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/events", require("./routes/events"));
app.use("/api/swaps", require("./routes/swaps"));

//Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running ✅" });
});

//Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
