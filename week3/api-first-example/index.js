// get the port number from env file
require("dotenv").config();
const PORT = process.env.PORT;
const express = require("express"); //gets all the functionality from express and saves it in the variable express

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!! Ping:::Pong");
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:3000`);
});
