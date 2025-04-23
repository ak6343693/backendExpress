//rbac k liye

const jwt=require("jsonwebtoken");
const User=require("../models/User");

const authMiddleware=async(req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1];
    if(!token) return res.status(403).json({message:"Token mhi mila"});

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        console.log(decoded);
        const user=await User.findOne({email:decoded.email});
        console.log(user);
        if(!user) return res.status(404).json({message:"User not found"});
        req.user=user
        next();
    }
    catch(error){
        console.error(error);
        
        return res.status(500).json({message:"some Error"})
    }
}

const authorizeRole=(role)=>{
    return(req,res,next)=>{
        try {
            if(req.user.role!==role){
                // console.log(req.user.role,role);
                
                return res.status(400).json({message:"role not matched"});

                    }
                    console.log("role matched");
                    next()
        } catch (error) {
            console.log(error);
            
            return res.status(500).json({message:"unexpected error"});
        }
    }
}

module.exports={authorizeRole,authMiddleware};