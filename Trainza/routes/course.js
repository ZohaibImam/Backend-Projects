const {Router} = require("express");

const courseRouter = Router();

//User Wants to Purchase a course End Point
courseRouter.post("/purchase", (req,res)=>{
    
})

//All Courses End Point
courseRouter.get("/preview", (req,res)=>{
    
})

module.exports = {
    courseRouter : courseRouter
}