const {Router} = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = "Zaid123@45"

const userRouter = Router(); //Router is a place that will handle incoming request

//Signup End Point
userRouter.post("/signup", async (req,res)=>{
    const {email, password, firstName, lastName} = req.body;

    await userModel.create({
        email : email,
        password : password,
        firstName : firstName,
        lastName : lastName,
    })

    res.json({
        message: "User signed up successfully"
    })
})

//Signin End Point
userRouter.post("/signin", async (req,res)=>{
        const { email, password } = req.body;

    const user = await userModel.findOne({
        email: email,
        password: password
    })

    if (user){
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);

        res.json({
            token : token
        })
    }else{
        res.status(403).json({
            message : "Invalid credentials"
        })
    }
})

//Users Purchased Courses End Point
userRouter.get("/purchases", async (req,res)=>{
    const userId = req.userId;

    const purchases = await purchaseModel.find({
        userId : userId,
    })

    let purchasedCourseIds = [];

    for(let i = 0; i<purchases.length;i++){
        purchasedCourseIds.push(purchases[i].courseId)
    }

    const courseData = await courseModel.find({
        _id: { $in: purchaasedCourseIds }
    })

    res.json({
        purchases,
        courseData
    })
})

module.exports = {
    userRouter : userRouter
}