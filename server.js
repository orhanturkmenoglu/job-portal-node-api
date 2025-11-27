const express = require("express");
const colors  = require("colors");
const connectDB = require("./config/db");

require("dotenv").config();

const app = express();


connectDB().then(()=>{
    const PORT = process.env.PORT || 5173 ;
     app.listen(PORT, () => {
      console.log(
        `🚀 Node Server Running in ${process.env.DEV_MODE || "development"} mode on port ${PORT}`.green
      );
    });
})


module.exports = app;

