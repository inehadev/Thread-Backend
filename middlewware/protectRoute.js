const User = require('../models/usermodel');
const jwt=require('jsonwebtoken')


const protectRoute=async(req,res,next)=>{
    try {
        const token = req.header('x-auth-token');
        if(!token){
            console.log("Token not found");
            return res.status(401).json({message:"Unauthorized"}) ;
        }
        
        const decoded= jwt.verify(token,"x-jwt-token");
        const user = await User.findById(decoded.userId).select("-password"); 

         if (!user) {
            console.log("User not found for token:", decoded.userId);
            return res.status(401).json({ message: "not authorized" });
        }

req.token=token;
req.user = user;
next();      
    } catch (error) {
       res.status(500).json({message:error.message}) 
       console.log("Error in middleware:",error.message);

    }
}

module.exports=protectRoute;