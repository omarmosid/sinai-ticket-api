require('dotenv').config()
const express = require("express");
const cors = require('cors')
const app = express();
const path = require('path');
const connectDB = require("./config/db");

// Connect DB
connectDB();

// Init Middleware
app.use(cors())
app.use(express.json());

app.use("/api/tickets", require('./routes/api/ticket'))
app.use("/api/users", require('./routes/api/user'))

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/api", (req, res) => {
  res.send("Hello!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
