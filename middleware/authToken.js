const jwt = require('jsonwebtoken');

const verifyToken = (req,res,next)=>{
    const token = req.headers['authorization']?.split(' ')[1];// Bearer Tockem
    

    if(!token){ 
        return res.status(403).json({message:", A tocken is require for authenctication"});
    }

    try{
        const decoded=jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
    }catch (erroe){
        return res.status(401).json({message:"Invalid TOken"});
    }
    next();
};
module.exports=verifyToken