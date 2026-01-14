const express = require("express");
const mongoose  = require("mongoose");
const {userRouter} = require("./routes/user");
const {adminRouter} = require("./routes/admin");
const {courseRouter} = require("./routes/course");

const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

const port = 3000;

async function main() {
    console.log("Connecting to MongoDB...");
    await mongoose.connect("mongodb+srv://zaid_imam_db:Bamboo123@cluster0.pu7qzah.mongodb.net/trainza-app");
    app.listen(3000);
    console.log("listening on port 3000")
}

main()

