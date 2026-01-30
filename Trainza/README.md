# **Trainza - A Course Selling App (Backend)**

## Detailed Project Description

Trainza is a simple backend solution designed for a course sales application, implemented using a Node.js, Express, and MongoDB stack. The application has secure administration and user account systems, admin-controlled course-related operations like create, update, delete, and list, and user functionality like surfing, purchasing, and viewing the purchase history of courses. The application follows a clean separation of concerns, organizing it into routes, db, config, and middleware.

## Core capabilities

- **Admin workflows:** signup/signin, create/update/delete courses, list of courses created by the admin.
- **User workflows:** signup/signin, preview all public courses, purchase a course, list purchased courses.
- **Added public preview endpoint**, which allows clients to view the courses offered.
- **Authentication** using **JWTs** (separate secrets for admin and user), along with middleware to protect admin-only routes and user-only routes.
- **Input validation** for incoming requests using **zod**, and safe password storage using bcrypt.

## Architecture and key files

- **index.js:** application entry point — loads the environment variables, mounts routes (/api/v1/user, /api/v1/admin, /api/v1/course),
- **config.js:** Central place for runtime secrets read from the environment (e.g., JWT_ADMIN_PASSWORD, JWT_USER_PASSWORD). db.js: Mongoose schema and models for User, Admin, Course, and Purchase.
- **db.js:** It contains Mongoose schema and model definitions for User, Admin, Course, and Purchase.
- **admin.js:** admin endpoints (signup, signin, course operations)
- **user.js:** user-facing endpoints (signup, signin, purchase history).
- **course.js:** course routes for purchase, preview.
- **admin.js and user.js:** JWT verification middleware to populate req.adminId or req.userId.

## Data Model Summary

- **User/Admin:** email (unique), hashed password, firstName, lastName.
- **Course:** title, description, price, imageUrl, creatorId (references admin).
- **Purchase:** establishes the relationship between userId and courseId (helps to generate the user’s purchase history and avoid duplicate purchases).

## Authentication and Security Notes

- The JWT is issued upon a successful signin, and it needs to be included in the Authorization request header.
- Passwords are hashed using bcrypt before storage.
- Input validation is done using zod schemas in each route, and route handlers return clear validation errors if the input does not match the requirements.
- This file expects secrets and a database URL as environment variables, as used in the following section. It's strongly advised not to include a .env file in source control.

## Environment variables (used by the project)

- **MONGODB_URL** — MongoDB connection string.
- **JWT_ADMIN_PASSWORD** — secret to sign/verify admin JWTs.
- **JWT_USER_PASSWORD** — the secret used to sign/verify user JWTs.
- **PORT** — optional server port, defaults to 3000.

## Data model summary

- **User/Admin:** email (unique), hashed password, firstName, lastName
- **Course:** title, description, price, imageURL, creatorId (references admin).
- **Purchase:** links userId and courseId (used to generate a user’s purchase history and to prevent duplicate purchases).

## Recommended next steps for future

- Add an `npm start` script for easier launching (for example, `node index.js` or using `nodemon` for development).
- Use cookies instead of JWT for auth
- Add a rate limiting middleware
- Frontend in ejs (low priority)
- Frontend in React
