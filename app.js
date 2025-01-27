const express = require("express");
const path = require("path");
var cors = require("cors");
const userRouter = require("./routes/userRoutes");
const courseRouter = require("./routes/courseRoutes");

const app = express();

app.use(cors());

//serving static files
app.use(express.static(path.join(__dirname, "public")));

//body parser, reading data from body into req.body
app.use(express.json());
//form body parser from forms submit action
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/courses", courseRouter);

app.all("*", (req, res) => {
  res.status(404).json({
    status: "fail",
    message: "Not found",
  });
});

module.exports = app;
