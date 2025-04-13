const express = require("express");
const axios = require("axios");
const path = require("path");
const cors = require("cors");

const app = express();

app.get("/ping", (req, res) => {
  res.send("pong");
});


app.use(cors()); 
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // No Content
  }
  next();
});
app.use(express.json());

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    console.log("Received login data:", req.body);

    const response = await axios.post("https://reqres.in/api/login", req.body);

    console.log("Login API success:", response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Login API failed:", err.response?.data || err.message);
    res.status(err.response?.status || 500).json({ error: "Login failed" });
  }
});

// GET USERS
app.get("/api/users", async (req, res) => {
  try {
    const page = req.query.page || 1;
    const response = await axios.get(`https://reqres.in/api/users?page=${page}`);
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// UPDATE USER
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email } = req.body;
    const response = await axios.put(`https://reqres.in/api/users/${id}`, {
      first_name,
      last_name,
      email,
    });
    res.json(response.data);
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});

// DELETE USER
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await axios.delete(`https://reqres.in/api/users/${id}`);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(err.response?.status || 500).json({ error: err.message });
  }
});


const CLIENT_BUILD_PATH = path.join(__dirname, "..", "client", "build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get("*", (req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  });
}

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
