const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const User = mongoose.model("User", {
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
});

const Job = mongoose.model("Job", {
  companyName: { type: String, required: true },
  remote: { type: String, enum: ["Remote", "Office"], required: true },
  skillsRequired: { type: [String], required: true },
  recruiterName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  logoURL: { type: String, required: true },
  position: { type: String, required: true },
  salary: { type: String, required: true },
  jobType: {
    type: String,
    enum: ["full-time", "part-time", "intern"],
    required: true,
  },
  location: { type: String, required: true },
  description: { type: String, required: true },
  about: { type: String, required: true },
});

app.get("/", (req, res) => {
  res.json({ status: "SUCCESS", message: "All good" });
});

app.get("/health", (req, res) => {
  res.json({ server: "Job Listing", status: "active" });
});

const errorHandler = (res, error) => {
  console.log(error);
  res.status(500).json({ error: "Internal server error" });
};

app.post("/register", async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    console.log(name, email, mobile, password);

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "email is already registered" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, mobile, password: hashedPassword });
    await user.save();

    return res.json({ success: true, user: email, name: name });
  } catch (error) {
    errorHandler(res, error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    if (!email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(user.toJSON(), process.env.JWT_KEY);
    return res.json({
      success: true,
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    errorHandler(res, error);
  }
});

app.listen(process.env.PORT, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => console.log("server started on http://localhost:4000"))
    .catch((error) => {
      console.log(error);
    });
});
