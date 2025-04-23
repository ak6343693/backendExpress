const mongoose=require("mongoose");
//use method which is used to create schema is known as schema method

//collection me type define krne k liye schema use krte h
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    otp:{type:String,required:false},
    role:{
        type:String,
        enum:["Student","Trainer","Counceler","Admin"]
    }
})
const User=mongoose.model('newCollection',userSchema);
module.exports=User;