const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema ({

})

const adminSchema = new Schema ({
    
})

const courseSchema = new Schema ({
    
})

const purchaseSchema = new Schema ({
    
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