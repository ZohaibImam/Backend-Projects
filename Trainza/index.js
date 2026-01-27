//Imported the dotenv module to load the environment variable from .env file
require("dotenv").config();

//Imported express for building the web server and Mongoose fro MongoDB interactions
const express = require("express");
const mongoose  = require("mongoose");

//Imported the route handlers for user, admin and course functionality from the routes folder
const {userRouter} = require("./routes/user");
const {adminRouter} = require("./routes/admin");
const {courseRouter} = require("./routes/course");

//Initialized the express application
const app = express();

//Middleware to automatically parse incoming JSON requests data and make it available in req.body
app.use(express.json()); 

//Retrieved the PORT from .env file, default to 3000 if it is not provided
const port = process.env.PORT || 3000;

//Retrieved the MongoDB connection string (MONGODB_URL) from the .env File

//Used the imported routers for handling specefic routes
//All user related request will go to /api/v1/user
app.use("/api/v1/user", userRouter);

//All admin related request will go to /api/v1/admin
app.use("/api/v1/admin", adminRouter);

//All course related request will go to /api/v1/course
app.use("/api/v1/course", courseRouter);


//Main function to handle database connection and server start
async function main() {
    try{
        //Connected to the MongoDB database using the MONGODB_URL
        await mongoose.connect(MONGODB_URL);

        //Logginf a success message to the console if the database connection is established
        console.log("Connecting to MongoDB...");

        //Started the server and listen for incoming request on the specefic PORT
        app.listen(port, () => {
            //Logging a message to indicate that the server is running and listening to requests
            console.log(`Server is running on port ${port}`);
        });

    }catch(error){
        //Logging an error message if the connection to the database fails
        console.log("Failed to connect to the database", error);

    }
    
}

//Invoking the main function to initiate the server and database connection
main()

