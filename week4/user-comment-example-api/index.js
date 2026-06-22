require("dotenv").config();
// use express morgan dependencies

const express = require("express");
const morgan = require("morgan"); // do not need this

const userRoutes = require("./routes/userRoute");

const app = express();
const PORT = process.env.PORT;

//Middleware
//----add code here
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send(`User Comment Example API`);
});

app.use("/users", userRoutes);
// app.use("/comments", ()=>{})

app.listen(PORT, () => {
  console.log(`Server running at http://localhost::${PORT}`);
});
