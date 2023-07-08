require("dotenv").config();
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const compression = require("compression");
const helmet = require("helmet");
const indexRouter = require("./routes/index");
const inventoryRouter = require("./routes/inventory");
const categoryRouter = require("./routes/category");

const app = express();

// connect to db
const mongoose = require("mongoose");
const mongoDB = process.env.MONGODB_URL || "";
mongoose.set("strictQuery", false);

main()
  .then(() => console.log("> connected to db"))
  .catch(err => console.log(err));
async function main() {
  if (!mongoDB) {
    console.log("MONGODB_URL not found in .env file");
    return;
  }
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// enable gzip compression: compress all routes
app.use(compression());

// enable helmet: vulnerability protection
app.use(helmet());

// express generator goodies
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// setup routes
app.use("/", indexRouter);
app.use("/inventory", inventoryRouter);
app.use("/categories", categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
