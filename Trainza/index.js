const express = require("express");

const app = express();
const port = 3000;


//Signup End Point
app.get("/user/signup", (req,res)=>{
    
})

//Signin End Point
app.post("/user/signin", (req,res)=>{
    
})

//Users Purchased Courses End Point
app.get("/user/purchases", (req,res)=>{
    
})

//User Wants to Purchase a course End Point
app.post("/course/purchase", (req,res)=>{
    
})

//All Courses End Point
app.get("/courses", (req,res)=>{
    
})


express.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
})

