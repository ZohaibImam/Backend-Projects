const {Router} = require("express");

const userRouter = Router(); //Router is a place that will handle incoming request

//Signup End Point
userRouter.post("/user/signup", (req,res)=>{
    
})

//Users Purchased Courses End Point
userRouter.get("/user/purchases", (req,res)=>{
    
})

//Signin End Point
userRouter.post("/user/signin", (req,res)=>{
    
})

module.exports = {
    userRouter : userRouter
}