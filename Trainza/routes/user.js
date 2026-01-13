const {Router} = require("express");

const userRouter = Router(); //Router is a place that will handle incoming request

//Signup End Point
userRouter.post("/signup", (req,res)=>{
    
})

//Signin End Point
userRouter.post("/signin", (req,res)=>{
    
})

//Users Purchased Courses End Point
userRouter.get("/purchases", (req,res)=>{
    
})

module.exports = {
    userRouter : userRouter
}