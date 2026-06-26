require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express");
const morgan = require("morgan"); // do not need this

const userRoutes = require("./routes/userRoutes");
const app = express(); //Middleware

app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`Server is running`);
});

app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
