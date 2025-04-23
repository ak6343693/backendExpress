const express=require("express");

const connectDB=require("./database");

const User=require("./userss")

require('dotenv').config()

const app=express();

connectDB();
app.use(express.json())
app.post('/register_user',async (req,res)=>{
    try{
        const {name,email,password,role}=req.body;
        const newUser=User({name,email,password,role});

        await newUser.save()
        console.log("Success")
        return res.status(200).json({message:"User Registered Successfully"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error in User Registration"})
    }
})

app.listen(3010,()=>{
    console.log("Server is running on local host 3010")
})