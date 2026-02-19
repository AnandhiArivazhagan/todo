//install packages
const mongoose= require("mongoose");

 // define schema 
const todoschema= new mongoose.Schema({
userTask: { type: String, required: true },          //
completed: { type: Boolean, default: false },
createdAt: { type: Date, default: Date.now },
updatedAt: { type: Date, default :Date.now },

});
//convert schema into modules
module.exports=mongoose.model("todo",todoschema);   