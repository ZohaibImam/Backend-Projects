const {Router} = require("express");
const { purchaseModel, courseModel } = require("../db")

const courseRouter = Router();

//User Wants to Purchase a course End Point
courseRouter.post("/purchase", async (req,res)=>{
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message: "You have successfully bought the course"
    })

})

//All Courses End Point
courseRouter.get("/preview", async (req,res)=>{
    const courses = await courseModel.find({});

    res.json({
        courses : courses
    })
})

module.exports = {
    courseRouter : courseRouter
}