require('dotenv').config()
const express = require("express");
const app = express();
const connectDB = require("./config/db");

const PORT = 4000 || process.env.PORT;

// Connect DB
connectDB();

// Init Middleware
app.use(express.json());

app.use("/api/tickets", require('./routes/api/ticket'))

app.get("/", (req, res) => {
  res.send("Hello!");
});


app.get("/api", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`listening on ${PORT}`);
});
