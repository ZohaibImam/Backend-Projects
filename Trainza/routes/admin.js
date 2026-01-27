const { Router } = require("express");
const { adminModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_ADMIN_PASSWORD = "admin@12Secret";
const zod = require("zod");
const bcrypt = require("bcrypt");

const adminRouter = Router();

//Defined a POST route for admin signUp
adminRouter.post("/signup", async (req,res)=>{
    //Defined the schema for validating the request body data using zod
    const requireBody = zod.object({
        email : zod.string().email({}).min(5), //Email must be valid email format with minimum of 5 characters
        password : zod.string().min(5),  //Password must be atleast 5 characters long      
        firstName : zod.string().min(3), //First name must be atleast 3 characters long
        lastName : zod.string().min(3), //Last name must be atleast 3 characters long
    })

    //Parsed and validated the incoming request body data
    const parseDataWithSuccess = requireBody.safeParse(req.body);

     //If validation fails, returned the 400 error with the validation error details
    if(!parseDataWithSuccess.success){
        return res.status(400).json({
            message : "Incorrect Data Format",
            errors : parseDataWithSuccess.error, //Zod provides details about the validation error
        })
    }

    //Extracted validated email, password, firstName and lastName from the request body
    const {email, password, firstName, lastName} = req.body;

    //Hashed the admin password using bycrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    //Creating new admin in the database
    try{
        //created a new admin entry with the provided mail, hashed password, firstName and lastName
        
        await adminModel.create({
            email : email,
            password : hashedPassword, //Stores the hashed password instead of plain text password
            firstName : firstName,
            lastName : lastName,
        });

    }catch(error){
        //If there is any error during the creation, returns the 404 error with the message
        return res.status(404).json({
            message : "You are already signed up" //provided a message indicating signup failure
        })

    }

    //sending a 201 success response back to the admin indicating successful signup admin
    res.status(201).json({
        message: "You signed up successfully" 
    })
})

//Defined a POST route for admin signIn
adminRouter.post("/signin", async (req,res)=>{
    //Defined the schema for validating the request body data using zod
    const requireBody = zod.object({
        email : zod.string().email({}), //Email must be valid email format
        password : zod.string().min(6), //Password must be atleast 6 characters long
    })

    //Parsed and validated the incoming request body data
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    //If validation fails, returned the 400 error with the validation error details
        if(!parseDataWithSuccess.success){
        return res.status(400).json({
            message : "Incorrect Data Format",
            errors : parseDataWithSuccess.error, //Zod provides details about the validation error
        })
    }

    //Extracted validated email and password from the request body
    const { email, password } = req.body;

    //Attempted to find a admin in the database with the provided email and password
    const admin = await adminModel.findOne({
        email: email, //Querying the admin by email
    });

    //If the admin is not found, returned a 403 error indicating incorrect credentials
    if(!admin){
        return res.status(403).json({
            message : "Incorrect Credentials" //Error message for invalid login credentials
        });
    }

    //comapred the provided password with the stored hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, admin.password);

    //If the password matches, create a JWT token and send it to the admin
    if (passwordMatch){
        //Created a JWT token containing the admin ID, signed with the JWT_ADMIN_PASSWORD
        const token = jwt.sign({
            id: admin._id,
        }, JWT_ADMIN_PASSWORD);

        //Send generated token back to the admin
        res.status(200).json({
            token : token //Included the token in the response
        });
    }else{
        //If the password does not match, returned 403 error indicating invalid credentials admin 
        res.status(403).json({
            message : "Invalid credentials!" //Error message for invalid password comparison
        });
    }
});

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


