//Requirement Package
require("express-async-errors");
//Requirement Package
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();

const app = express();

//Router
const authentication = require("./router/authentication");
const categoryRouter = require("./router/categoryRouter");
const productRouter = require("./router/productRouter");
const orderRouter = require("./router/orderRouter");

const { error } = require("./middleware/error");
// DataBase
require("./db/db");

//MiddeleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    credentials: false,
    allowedHeaders: "Content-Type, Accept",
  })
);

//API
app.use("/", authentication);
app.use("/api/category", categoryRouter);
///api/v2/product
app.use("/api/product", productRouter);
app.use("/api/v1/", orderRouter);

// if any middelware use for error handeling then err must be pass first
app.use(error);

module.exports = app;
