const express = require("express");

require("dotenv").config();

const app = express();


app.get("/",(req,res)=>{
    res.send("<h1>HELLO NODE JS !</h1>")
})


app.listen(process.PORT || 5173 ,()=>{
    console.log("RUNNING SERVER ");
})