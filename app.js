const express = require("express");
const cors = require("cors");
const colors = require("colors");
const routes = require("./routes/index");
const setupSwagger = require("./config/swagger");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
const loggerMiddleware = require("./middlewares/logger.middleware");

require("dotenv").config();

// async route’larda try/catch yazmana gerek kalmaz, tüm hatalar otomatik global error middleware’e düşer.
// controllerlarda try catch ihtiyacı olmaz.
require("express-async-errors");

const app = express();

app.use(cors());

setupSwagger(app);

app.use(cookieParser());

app.use(express.json());

app.use(loggerMiddleware);

app.use("/api/v1",routes);

app.use(errorMiddleware);


module.exports = app;