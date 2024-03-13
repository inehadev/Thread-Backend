const User = require('../models/usermodel');
const jwt=require('jsonwebtoken')

const protectRoute=async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token)
return res.status(401).json({message:"Unauthorized"}) ;
const decoded= jwt.verify(token,"secureKey");
const user = await User.findById(decoded.userId).select("-password"); 
req.user= user;
next();      
    } catch (error) {
       res.status(500).json({message:error.message}) 
       console.log("Error in middleware:",error.message);

    }
}

module.exports=protectRoute;