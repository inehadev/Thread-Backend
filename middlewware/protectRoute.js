const User = require('../models/usermodel');
const jwt=require('jsonwebtoken')
const generateTokenAndSetCookies =require('../utilis/helper/generateTokenAndSetCookies')

const protectRoute=async(req,res,next)=>{
    try {
        console.log(req.cookies)
        const token = req.cookies.jwt;
        if(!token){
            console.log("Token not found")
            return res.status(401).json({message:"Unauthorized"}) ;
        }
        
        const decoded= jwt.verify(token,"x-auth-token");
        const user = await User.findById(decoded.userId).select("-password"); 

         if (!user) {
            console.log("User not found for token:", decoded.userId);
            return res.status(401).json({ message: "not authorized" });
        }


req.user = user;
next();      
    } catch (error) {
       res.status(500).json({message:error.message}) 
       console.log("Error in middleware:",error.message);

    }
}

module.exports=protectRoute;