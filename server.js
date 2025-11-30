const express = require("express");
const cors = require("cors");
const colors = require("colors");
const connectDB = require("./config/db");
const testRoutes = require("./routes/test.routes");
const authRoutes = require ("./routes/auth.routes");
const userRoutes = require('./routes/user.routes');
const jobsRoutes = require('./routes/jobs.routes');

const morgan = require("morgan");
const errorMiddleware = require("./middlewares/error.middleware");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// async route’larda try/catch yazmana gerek kalmaz, tüm hatalar otomatik global error middleware’e düşer.
// controllerlarda try catch ihtiyacı olmaz.
require("express-async-errors");

const app = express();

app.use(cookieParser());

app.use(express.json());

// HTTP isteklerini konsola yazdırır (GET, POST, status code vs.)
app.use(morgan("dev"));

app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth",authRoutes);
app.use("/api/v1/users",userRoutes);
app.use("/api/v1/jobs",jobsRoutes);

app.use(errorMiddleware);


connectDB().then(() => {
  const PORT = process.env.PORT || 5173;
  app.listen(PORT, () => {
    console.log(
      `🚀 Node Server Running in ${
        process.env.DEV_MODE || "development"
      } mode on port ${PORT}`.green
    );
  });
});

module.exports = app;
