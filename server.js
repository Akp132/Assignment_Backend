const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

// ✅ CORS setup
app.use(cors({
  origin: "*", // or restrict to your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use(express.json());

// ✅ API Routes
app.post("/api/login", async (req, res) => {
  try {
    const response = await axios.post("https://reqres.in/api/login", req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: "Login failed" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const response = await axios.put(`https://reqres.in/api/users/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    await axios.delete(`https://reqres.in/api/users/${req.params.id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// ✅ Port
const PORT = parseInt(process.env.PORT) || 5050;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
