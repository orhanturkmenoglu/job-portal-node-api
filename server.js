const express = require("express");

const app = express();


app.get("/",(req,res)=>{
    res.send("<h1>HELLO NODE JS !</h1>")
})


app.listen(5173,()=>{
    console.log("RUNNING SERVER");
})