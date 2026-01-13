const express = require("express");
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");

app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);

const app = express();
const port = 3000;

express.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
})

