// load the package
const express=require("express");
const mongoose=require("mongoose");

const todo=require("./model/todo"); // to load the key values in database 

const app=express();   //create the application object

const cors=require("cors");    //connect the frontend  and backend

app.use(express.json());           // get the data from the body of the request

app.use(cors());  



mongoose.connect("mongodb://localhost:27017/todoDB")
       .then(()=>{console.log(" connected to database")})
       .catch((err)=>{console.log(err)});

//CRUD operation
 app.get("/todolist", async(req,res)=>{
       const todoget= await todo.find();
       res.json(todoget);
 });

app.post("/todolist",async(req,res)=>{
       const todopost=new todo({userTask:req.body.userTask});
       await todopost.save();
       res.json(todopost);



});


app.put("/todolist/:id",async(req,res)=>{
       const todoput=await todo.findByIdAndUpdate(req.params.id,
                         {userTask: req.body.userTask,completed:req.body.completed},
                         {new:true},
       );
       res.json(todoput);
});

app.delete("/todolist/:id",async(req,res)=>{
       await todo.findByIdAndDelete(req.params.id);
       res.json({message:"task deleted"});
});


//start the server
app.listen(3000,()=>{console.log("server started")});

