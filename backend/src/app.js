const express = require("express");
const ethereumRoutes = require("./routes/ethereumRoutes");
var cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());
app.use("/api/ethereum", ethereumRoutes);

module.exports = app;
