//Impoted the JWT module to handle JSON Web Tokens
const jwt = require("jsonwebtoken");

//Imported the JWT user password from the config file for verification
const {JWT_ADMIN_PASSWORD} = require("../config");

//Defined the adminMiddleware function to verify the admin token
const adminMiddleware = (req, res, next) => {
    //Get the token from the request headers, which is expected to be sent in the authorization header
    const token = req.headers.authorization;

    //Used a try catch block to handle any errors that may occur during token verificatioon
    try{
        //Verified the token using the JWT user password to check its validity 
        const decoded = jwt.verify(token, JWT_ADMIN_PASSWORD);

        //Set the userId in the request object from the decoded token for later use
        req.adminId = decoded.id;

        //Called the next middleware in the stack to proceed with the request 
        next();
    }catch(error){
        //If the token is invalid or an error occurs during verification, send an error message to the client
        return res.status(403).json({
            message : "You are not signed in!", //Informed the user that they are not authorized
        })

    }

}

//Exported the userMiddleware function so that it can be used in the other files
module.exports = {
    adminMiddleware : adminMiddleware
}