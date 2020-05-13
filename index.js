const express = require("express");
const app = express();
const connectDB = require("./config/db");

// Connect DB
connectDB();

// Init Middleware
app.use(express.json());

app.use("/api/tickets", require('./routes/api/ticket'))

app.get("/api", (req, res) => {
  res.send("Hello!");
});

app.listen(4000, () => {
  console.log(`listening on 4000`);
});
