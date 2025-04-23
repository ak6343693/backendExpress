//database connect line 1-19

const express=require("express");

const connectDB=require("./database");

const User=require("./models/User");

const Course=require("./models/course");

require('dotenv').config();

const sendMail = require("./nodemalierConfig")

const logger = require("./middleware/logger")

const errorHandler=require("./middleware/errorHandler")

const {authorizeRole,authMiddleware}=require("./middleware/authorisation")

const upload=require("./config/multer")

const authToken=require("./middleware/authToken")
const jwt= require("jsonwebtoken")

const cors=require("cors");
const bcrypt=require("bcrypt")

//express js me hm 1 application bna kr kitne bhi http(get,fetch,etc..) method use kr skte h

const app=express();

connectDB();

//frontend and backend wala posrt alg alg h usko handle krne k liye
app.use(cors({
  origin: "http:/localhost:3000",
  credentials:true,
}))

const next = app.use(errorHandler);

app.use(express.json())
//ye line hme db me json formate to data parse(bhejna) me help kregi
//db me

//for hosting any password we will use bcrypt.hash method
//for matching a normal password with hash password we will use bcrypt.compare method.
//bcrpt method
//we will need only two parameter if we have to hash any password
//1) password 2)saltRounds-> a sertified no with algorithiom will be hitted->genSalt method

// app.post("/register-users",logger,async (req,res)=>{
//     try{
//         const {name,email,password,contact,role}=req.body;
//         //for saving this data
//         const saltRounds=await bcrypt.genSalt(10);
//         const hasedPassword=await bcrypt.hash(password,saltRounds);
//         console.log(hasedPassword);
//         const result=await bcrypt.compare(password,hasedPassword);
//         console.log("value of matched password is ",result)

//         const otp=Math.floor(100000+Math.random()*900000).toString();
//         const newUser=new User({name,email,password,contact,otp,role});
//         await newUser.save();
//         const subject=`Welcome to our platform, your otp for varification`
//         const text=`Hi ${name}, Thanks,otp :${otp}`;
//         const html=`<h1>Hi ${name}</h1> <h2>thanks for registering</h2>
//         <p>OTP :${otp}</p>`;
//         sendMail(email,subject,text,html)
//         console.log("Data inserted successfully")
//     return res.status(200).json({message:"Data is inserted successfully"});
//     }
//     //new keyword ka mtlb h ki new object create hoga isko save krne k liye (await newUser,save();) likhna hota h
//     catch(error){
//         console.log(error)
//         return res.status(500).json({message:"Internel Server Error"})
//     }
// })

app.post("/login",logger,async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(403).json({message:"User Not Existing"});
        }
        const result=  password === user.password;
        if(result=== "false"){
            return res.status(402).json({message:"Password is not matched"});
        }

        //generate JWT token   
        const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'1h'});


        return res.status(200).json({message:"login successfully",token});
    } catch(error){
        next(error);
    }
});

// app.post("/verify",logger,async(req,res)=>{
//     try{
//         const{email,otp}=req.body;
//         const user=await user.findOne({email});
//         if(!user){
//             return res.status(404).json({message:"user not found"});
//         }
//         if(user.otp===otp){
//             return res.status(200).json({message:"otp matched"});
//         }
//         return res.status(400).json({message:"otp not matched"});
//     }catch(error){
//         return res.status(500).json({message:"an error occerd"});
//     }
// })


//database se data extract krne k liye get method ka use krenge
//update special field

// app.get("/allusers",logger,authMiddleware,authorizeRole("Trainer"),async(req,res)=>{
//     try{
//         const users=await User.find()
//             res.json(users)
//     }catch(error) {
//         next(error)
//     } 
// })

// app.put("/update/:id",logger,async (req,res)=>{
//     try{
//         //find by id and update -> sbse pehle id kay base pr find krna phir update krna
//         const id=req.params.id;
//         const{name,email,password,contact}=req.body;
//         const updateuser=await User.findByIdAndUpdate(req.params.id,{name,email,password,contact},{new:true})
//         if(!updateuser)
//         {
//             return res.status(404).json({message:"User not Found"
//             })
//         }
//         return res.status(200).json(updateuser)
//     }
//     catch(error){
//         return res.status(500).json({message:"an error occurred"})
//     }
// })
    
    //jb postman ki request se koi data uthayenge to req.params.data(id) ys use krenge




    //delete
    // app.delete("/delete/:id",async(req,res)=>{
    //     try{
    //         //delete by id -> id kay base pr delete krna
    //         const deleteduser=await User.findByIdAndDelete(req.params.id);
    //         if(!deleteduser)
    //         {
    //             return res.status(404).json({message:"User not Found"})
    //         }
    //         return res.status(200).json(deleteduser)
    //     } catch(error){
    //         return res.status(500).json({message:"an error occurred"})
    //     }
    
    // })

    
    //app.post("/verify",logger,async(res))

    //course add
    
app.post('/addcourse',authMiddleware,authorizeRole('counsellor'),upload.single("banner"),async (req,res)=>{
    try{
        const {title,trainer,duration,discription,category,discountPeracentage,offerTillDate,startDate,isFeatured,endDate}=req.body;
        const banner=req.file.path;
        const newCourse=Course({title,trainer,duration,discription,category,discountPeracentage,offerTillDate,startDate,isFeatured,endDate,banner});

        await newCourse.save()
        console.log("Success")
        return res.status(200).json({message:"Course Registered Successfully"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message:"Error in Course Registration"})
    }
})

app.get('/allcourse',async (req,res) => {
    try {
        const{search,duration,category}=req.query;
        let filter={}
        if(search){
            filter.title={$regex:search,$options:"i"}
        }
        if(duration){
            filter.duration={$regex:duration,$options:"i"};
        }
        if(category){
            filter.category={$regex:category,$options:"i"};
        }

        const course=await Course.find(filter);
        res.json(course);
        return res.status(200).json({message:"user showing"})

        // const find = await Course.find()
        // res.json(find)
        // return res.status(200).json({message:"All user showing"})
    } catch (error) {
        return res.status(500).json({message:"Error in all Course showing"})
    }
    
})

//edit course

// app.patch("/updatecourse/:title",logger,async (req,res)=>{
//         try{
//             const title=req.params.title;
//             const{trainer,duration,discription,category,discountPercentage,offerTillDate,startDate,isFeatured,endDate}=req.body;
//             const updateCourse=await User.findOneAndUpdate({title:req.params.title},{trainer,duration,discription,category,discountPercentage,offerTillDate,startDate,isFeatured,endDate},{new:true})
            
//             if(!updateCourse)
//             {
//                 return res.status(404).json({message:"Course not Found"
//                 })
//             }
//             return res.status(200).json(updateCourse)
//         }
//         catch(error){
//             return res.status(500).json({message:"error in course updating"})
//         }
//     })


app.patch('/edit', async (req, res) => {
  try {
    const { search } = req.query;

    let filters = {};
    if (search) {
      filters.title = { $regex: search, $options: 'i' };
    }

    const {
      title,
      trainer,
      duration,
      discription,
      category,
      discountPeracentage,
      offerTillDate,
      startDate,
      isFeatured,
      endDate,
      banner,
    } = req.body;

    const updateCourse = await Course.findOneAndUpdate(
      filters,
      {
        $set: {
          title,
          trainer,
          duration,
          discription,
          category,
          discountPeracentage,
          offerTillDate,
          startDate,
          isFeatured,
          endDate,
          banner,
        },
      },
      { new: true }
    );

    if (!updateCourse) {
      return res.status(404).json({ message: 'Course not Found' });
    }

    res.json(updateCourse);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unwanted Error' });
  }
});



app.listen(3000,()=>{
    console.log("server is running on localhost 3k")
})

//npx kill-port 3000
//taskkill

//npm install cors