const express = require("express");
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");

app.use("/user", userRouter);
app.use("/course", courseRouter);

const app = express();
const port = 3000;

express.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
})

