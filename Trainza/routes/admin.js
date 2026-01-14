const { Router } = require("express");
const {adminModel} = require("../db")

const adminRouter = Router();

//Signup End Point of Admin
adminRouter.post("/signup", (req,res)=>{
    
})

//Signin End Point of Admin
adminRouter.post("/signin", (req,res)=>{
    
})

//Course Creation End Point by Admin
adminRouter.post("/", (req,res)=>{
    
})

//Course Updation End Point by Admin
adminRouter.put("/", (req,res)=>{
    
})

//To get all the Course Created End Point by Admin
adminRouter.get("/bulk", (req,res)=>{
    
})

module.exports = {
    adminRouter : adminRouter
}


