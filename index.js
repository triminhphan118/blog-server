const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// ROUTER
const routerAuth = require("./routes/auth");
const routerUser = require("./routes/user");
const routerCategory = require("./routes/category");
const routerPost = require("./routes/posts");
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "https://blogpmt.tk/",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(
  express.urlencoded({
    extended: true,
  })
);

mongoose.connect(process.env.URL_MONGO, (a) => {
  console.log(a);
  console.log("Connected to Mongo DB");
});

app.get("/", (req, res) => {
  res.json("ji");
});

app.use("/api/v1/auth", routerAuth);
app.use("/api/v1/user", routerUser);
app.use("/api/v1/category", routerCategory);
app.use("/api/v1/posts", routerPost);

app.listen(process.env.PORT, () => {
  console.log("Server is running.");
});
