
const connectDB = require("./config/db");

const app = require("./app")

connectDB();

const PORT = process.env.PORT || 5173;


app.listen(PORT, () => {
  console.log(
    `🚀 Node Server Running in ${
      process.env.DEV_MODE || "development"
    } mode on port ${PORT}`.green
  );
  console.log(`📚 Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
