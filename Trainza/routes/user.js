const {Router} = require("express");
const { userModel, purchaseModel, courseModel } = require("../db");
const jwt = require("jsonwebtoken");
const JWT_USER_PASSWORD = "Zaid123@45"
const zod = require("zod");
const bcrypt = require("bcrypt");

const userRouter = Router(); //Router is a place that will handle incoming request

//Defined a POST route for user signUp
userRouter.post("/signup", async (req,res)=>{
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

    //Hashed the user password using bycrypt with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    //Creating new user in the database
    try{
        //created a new user entry with the provided mail, hashed password, firstName and lastName
        
        await userModel.create({
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

    //sending a 201 success response back to the client indicating successful signup
    res.status(201).json({
        message: "You signed up successfully"
    })
})

//Dedined a POST route for user signIn
userRouter.post("/signin", async (req,res)=>{
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

    //Attempted to find a user in the database with the provided email and password
    const user = await userModel.findOne({
        email: email, //Querying the user by email
    });

    //If the user is not found, returned a 403 error indicating incorrect credentials
    if(!user){
        return res.status(403).json({
            message : "Incorrect Credentials" //Error message for invalid login credentials
        });
    }

    //comapred the provided password with the stored hashed password using bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);

    //If the password matches, create a JWT token and send it to the client
    if (passwordMatch){
        //Created a JWT token containing the User ID, signed with the JWT_USER_PASSWORD
        const token = jwt.sign({
            id: user._id,
        }, JWT_USER_PASSWORD);

        //Send generated token back to the client
        res.status(200).json({
            token : token //Included the token in the response
        });
    }else{
        //If the password does not match, returned 403 error indicating invalid credentials
        res.status(403).json({
            message : "Invalid credentials!" //Error message for invalid password comparison
        });
    }
});

//Defined a GET route for the fetching purchases made by the authenticateduser
userRouter.get("/purchases", async (req,res)=>{
    //Get the userId from the request object set by the userMiddleware 
    const userId = req.userId;

    //Finds all purchase records, associated with the authenticated userId
    const purchases = await purchaseModel.find({
        userId : userId, //Querying purchases by userId
    })

    //If no purchases are found, return a 404 error response to the client
    if(!purchases){
        return res.status(404).json({
            message : "No purchases found "
        });
    }

    //If purchases are found, extracted the courseIds from the found purchases
    const purchasesCourseIds = purchases.map((purchase) => purchase.courseId);

    //Finding all course details for the purchased courseIds
    const coursesData = await courseModel.find({
        _id : { $in : purchasesCourseIds }, //Querying courses using the extracted course Ids
    });

    //Sending the purchases and corresponding courses details back to the client
    res.status(200).json({
        purchases, //Includes purchase data in the response
        coursesData, //Includes course data in the response
    })
})

//Exported the userRouter so it can be imported and used in the other parts of the application 
module.exports = {
    userRouter : userRouter
};