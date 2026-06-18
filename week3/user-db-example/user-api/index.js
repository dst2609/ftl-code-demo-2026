require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); //this lets the front end connect to the backend
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("User API is running");
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
