const mongoose=require("mongoose");
//use method which is used to create schema is known as schema method

//collection me type define krne k liye schema use krte h
const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    contact:{type:String,required:true},
    otp:{type:String,required:true},
    role:{
        type:String,
        enum:["Student","Trainer","Counceler","Admin"],default:'Student'
    }
})
const User=mongoose.model('User',userSchema);
module.exports=User;