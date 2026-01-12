const {Router} = require("express");

const courseRouter = Router();

//User Wants to Purchase a course End Point
app.courseRouter("/course/purchase", (req,res)=>{
    
})

//All Courses End Point
app.courseRouter("/courses", (req,res)=>{
    
})

module.exports = {
    courseRouter : courseRouter
}