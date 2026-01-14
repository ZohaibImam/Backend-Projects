const express = require("express");
const {userRouter} = require("./routes/user");
const {adminRouter} = require("./routes/admin");
const {courseRouter} = require("./routes/course");

const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

const port = 3000;

app.listen(port, ()=>{
    console.log(`App is listening to port ${port}`);
})

