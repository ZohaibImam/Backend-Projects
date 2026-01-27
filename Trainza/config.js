//Retrieved the JWT admin password fromenvironment variables 
const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD;

//Retrieved the JWT user password from environment variables
const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;

//Exported the retrieved JWT passwords so they can be used in other modules
module.exports = {
    JWT_ADMIN_PASSWORD,
    JWT_USER_PASSWORD
};