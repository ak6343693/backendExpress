const multer=require('multer');
const {CloudinaryStorage}=require("multer-storage-cloudinary");
const cloudinary=require("./cloudnary");
const storage=new CloudinaryStorage({
    cloudinary, //authanctication k liye
    params:{
    folder:"kodu-course",
    allowed_format:["jpg","png","jpeg","gif"]
    }
})

const upload=multer({storage}); //upload yha pe middleware ka kaam krega jo kodu-cources name se foleder bnayega or filr type check krega

module.exports=upload;