const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = "admin@12Secret";

const adminRouter = Router();

//Signup End Point of Admin
adminRouter.post("/signup", async (req,res)=>{
    const { email, password, firstName, lastName } = req.body; // TODO: adding zod validation
    
    await adminModel.create({
        email: email,
        password: password,
        firstName: firstName, 
        lastName: lastName
    })
    
    res.json({
        message: "Admin Signedup Successfully"
    })
})

//Signin End Point of Admin
adminRouter.post("/signin", async (req,res)=>{
    const { email, password} = req.body;

    const admin = await adminModel.findOne({
        email: email,
        password: password
    });

    if (admin) {
        const token = jwt.sign({
            id: admin._id
        }, JWT_ADMIN_PASSWORD);

        // Do cookie logic

        res.json({
            token: token
        })
    } else {
        res.status(403).json({
            message: "Incorrect credentials"
        })
    }
})

//Course Creation End Point by Admin
adminRouter.post("/", async (req,res)=>{
    const adminId = req.adminId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    })
    res.json({
        message: "Course created",
        courseId: course._id
    })


})

//Course Updation End Point by Admin
adminRouter.put("/", async (req,res)=>{
    const adminId = req.adminId;
    const { title, description, imageUrl, price, courseId } = req.body;

    const course = await courseModel.updateOne({
        _id: courseId, 
        creatorId: adminId 
    }, {
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price
    })

    res.json({
        message: "Course updated",
        courseId: course._id
    })
})

//To get all the Course Created End Point by Admin
adminRouter.get("/bulk", async (req,res)=>{
    const adminId = req.adminId;

    const courses = await courseModel.find({
        creatorId: adminId 
    });

    res.json({
        message : "All Courses fetched successfully",
        courses : courses
    })
})

module.exports = {
    adminRouter : adminRouter
}


