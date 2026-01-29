//Imprted the router object from the express module to create route handler
const { Router } = require("express");

//Created a new instance of router for defining user related routes
const adminRouter = Router();

//Imported the userModel, purchaseModel and courseModel from the database folder to interact with user, purchase and course details
const { adminModel, courseModel } = require("../db");

//Imported adminMiddleware to authenticate and authorize admins before allowing access to routes
const { adminMiddleware } = require("../middleware/admin");

//Defined a POST route for purchasing a course, with the user authentication middleware applied
courseRouter.post("/purchase", userMiddleware, async (req,res)=>{
    //Extracted userId from the request object, which was set by userMiddleware
    const userId = req.userId;

    //Extracted courseId from the request body sent by the client
    const courseId = req.body.courseId;

    //If the courseId is not provided in the the request body, return a 400 error response to the user
    if(!courseId){
        return res.status(400).json({
            message: "Please provide a valid courseId"
        })
    }

    //Checking if the user already purchased the course by querying the purchaseModel with courseId and userId
    const existingPurchase = await purchaseModel.findOne({
        courseId : courseId,
        userId : userId,
    })

    //If the user has already purchased the course, return a 404 error response to the client
    if(existingPurchase){
        return res.status(400).json({
            message : "You have already bought this course!",
        })
    }

    //Trying to create a new purchase entry in the database with the provided courseId and userId
    await purchaseModel.create({
        cuserId : userId,
        courseId : courseId,
    })

    //If the purchase is successfull, return a 201 status with a success message to the client 
    res.json({
        message: "You have successfully bought the course",
    })

});

//Defined a GET route for previewing all course details without authentication
courseRouter.get("/preview", async (res, req)=>{
    //Querying the database to get all the courses available for purchase
    const courses = await courseModel.find({});

    //Returned the queried course details as a JSON response to the client/user with a 200 status code
    res.status(200).json({
        courses : courses, //Send the course details back to the client/user
    })

});

//Exported the courseRouter so it can be imported and used in other parts of the application
module.exports = {
    courseRouter : courseRouter
}