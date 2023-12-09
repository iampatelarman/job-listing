const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

const User = mongoose.model("User", {
  name: String,
  email: String,
  phone: Number,
  password: String,
});

const Job = mongoose.model("Job", {
  title: String,
  description: String,
  minExperience: Number,
  datePosted: Date,
  reqSkills: String,
  lastDate: Date,
});

app.get("/", (req, res) => {
  res.json({ status: "SUCCESS", message: "All good" });
});

app.get("/health", (req, res) => {
  res.json({ server: "Job Listing", status: "active" });
});
app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("server started on http://localhost:4000"))
    .catch((error) => {
      console.log(error);
    });
});
