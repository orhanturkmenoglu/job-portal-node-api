const express = require("express");
const colors  = require("colors");
const connectDB = require("./config/db");

require("dotenv").config();

connectDB();

const app = express();

app.get("/",(req,res)=>{
    res.send("<h1>HELLO NODE JS !</h1>")
})

const PORT = process.PORT || 5173;

app.listen(PORT, () => {
    console.log(
        `Node Server Running In ${process.env.DEV_MODE} Mode on port no ${PORT}`.red
    );
});