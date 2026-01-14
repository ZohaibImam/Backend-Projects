const mongoose  = require("mongoose");
console.log("Connecting to MongoDB...");
mongoose.connect("mongodb+srv://zaid_imam_db:Bamboo123@cluster0.pu7qzah.mongodb.net/trainza-app");
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const userSchema = new Schema ({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
})

const adminSchema = new Schema ({
    email : {type : String, unique : true},
    password : String,
    firstName : String,
    lastName : String,
})

const courseSchema = new Schema ({
    title : String,
    description : String,
    price : Number,
    imageUrl : String,
    creatorId : ObjectId,
})

const purchaseSchema = new Schema ({
    userId : ObjectId,
    courseId : ObjectId,
})

const userModel = mongoose.model("user", userSchema);
const adminModel = mongoose.model("admin", adminSchema);
const courseModel = mongoose.model("course", courseSchema);
const purchaseModel = mongoose.model("purchase", purchaseSchema);

module.exports = {
    userModel : userModel,
    adminModel : adminModel,
    courseModel : courseModel,
    purchaseModel : purchaseModel
};