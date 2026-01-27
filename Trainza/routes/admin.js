//Imprted the router object from the express module to create route handler
const { Router } = require("express");

//Created a new instance of router for defining user related routes
const adminRouter = Router();

//Imported the userModel, purchaseModel and courseModel from the database folder to interact with user, purchase and course details
const { adminModel, courseModel } = require("../db");

//Imported adminMiddleware to authenticate and authorize admins before allowing access to routes
const { adminMiddleware } = require("../middleware/admin");

//Impoted the JWT admin secret from the configuration file for signing JWT tokens
const {JWT_ADMIN_PASSWORD} = require("../config");

//Imported necessary modules for handeling JWT authentication, password hashing and schema validation
const jwt = require("jsonwebtoken");
const zod = require("zod");
const bcrypt = require("bcrypt");


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

//Defined the admin routes for creating the course
adminRouter.post("/", adminMiddleware,async (req,res)=>{
    //Get the adminId from the request object 
    const adminId = req.adminId;

    //Validated the request body data using the zod schema (title, description, imageUrl, price must be valid)
    const requireBody = zod.object({
        title : zod.string().min(3), //Title must be atleast 3 characters
        description : zod.string().min(10), //Description atleast 10 characters
        imageUrl : zod.string().url(), //Image url must be valid URL format
        price : zod.number().positive(), //Price must be a valid positive number
    });

    //Parsed and validated the request body data
    const parseDataWithSuccess = requireBody.safeParse(req.body);

    //If the data format is incorrect, sending an error message to the admin
    if (!parseDataWithSuccess.success){
        return res.json({
            message : "Incorrect Data Format",
            errors : parseDataWithSuccess.error, 
        });
    }

    //Get title, description, imageUrl and price from the request body
    const { title, description, imageUrl, price, courseId } = req.body;

    //Created a new course with the given title, description, imageUrl, price and creatorId
    const course = await courseModel.create({
        title: title, 
        description: description, 
        imageUrl: imageUrl, 
        price: price, 
        creatorId: adminId
    });

    //Responded with the success message if the course is created successfully
    res.status(201).json({
        message: "Course created!",
        courseId: course._id
    });

});

//Defined an admin route for updating a course 
adminRouter.put("/", adminMiddleware, async (req,res)=>{
    //Get the adminId from the request object 
    const adminId = req.adminId;

    //Designed a schema using zod to validate the request body for updating a course
        const requireBody = zod.object({
            courseId : zod.string().min(5), //Ensures course id is atleast 5 characters long 
            title : zod.string().min(3).optional(), //Title must be atleast 3 characters and it is optional
            description : zod.string().min(10).optional(), //Description atleast 10 characters and it is optional
            imageUrl : zod.string().url().min(5).optional(), //Image url must be valid URL format and it is optional
            price : zod.number().positive().optional(), //Price is optional
        });

        // Parse and validate the incoming request body against the schema
        const parseDataWithSuccess = requireBody.safeParse(req.body);

        // If validation fails, responded with an error message and the details of the error
        if (!parseDataWithSuccess.success) {
            return res.json({
                message: "Incorrect data format", // Informed the admin about the error
                error: parseDataWithSuccess.error, // Provided specific validation error details
            });
        }

    // Destructured the validated fields from the request body
    const { courseId, title, description, imageUrl, price } = req.body;

    // Attempted to find the course in the database using the provided courseId and adminId
    const course = await courseModel.findOne({
        _id: courseId, // Match the course by ID
        creatorId: adminId, // Ensure the admin is the creator
    });

    // If the course is not found, responded with an error message
    if (!course) {
        return res.status(404).json({
            message: "Course not found!", // Inform the client that the specified course does not exist
        });
    }

    // Updated the course details in the database using the updates object
    await courseModel.updateOne(
        {
            _id: courseId, // Matched the course by ID
            creatorId: adminId, // Ensured the admin is the creator
        },

        { 
            title: title || course.title, // Updated title if provided, otherwise kept the existing title
            description: description || course.description, // Updated description if provided, otherwise kept the existing description
            imageUrl: imageUrl || course.imageUrl, // Updated imageUrl if provided, otherwise kept the existing imageUrl
            price: price || course.price, // Updated price if provided, otherwise kept the existing price
         } 
    );

    // Responded with a success message upon successful course updatation
    res.status(200).json({
        message: "Course updated!", // Confirms successful course update
    });
});


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


