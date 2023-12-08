const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.json({ status: "SUCCESS", message: "All good" });
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("server started on http://localhost:4000"))
    .catch((error) => {
      console.log(error);
    });
});
