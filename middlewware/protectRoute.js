const User = require('../models/usermodel');
const jwt=require('jsonwebtoken')

const protectRoute=async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            console.log("Token not found")
            return res.status(401).json({message:"Unauthorized"}) ;
        }
        

const decoded= jwt.verify(token,"x-auth-token");
const user = await User.findById(decoded.userId).select("-password"); 
res.cookie('jwt', token, { httpOnly: true, path: '/' });
console.log(res.cookie);
next();      
    } catch (error) {
       res.status(500).json({message:error.message}) 
       console.log("Error in middleware:",error.message);

    }
}

module.exports=protectRoute;