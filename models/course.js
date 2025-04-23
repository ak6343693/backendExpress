const mongoose=require("mongoose");

const slugify=require("slugify");
//use method which is used to create schema is known as schema method

//collection me type define krne k liye schema use krte h
const userSchema=new mongoose.Schema({
    title:{type:String,required:true},
    trainer:{type:String,required:true},
    duration:{type:String,required:true},
    discription:{type:String,required:true},
    category:String,
    discountPeracentage:String,
    offerTillDate:String,
    startDate:String,
    isFeatured:String,
    endDate:String,
    banner:{type:String,required:true},
    //title,trainer,duration,discription,category,discountPeracentage,offerTillDate,startDate,isFeatured,endDate,banner

})

userSchema.pre('save',function(next){
    if(!this.slug){
        this.slug=slugify(this.title);
    }
    next()
})
const Course=mongoose.model('course',userSchema);
module.exports=Course;