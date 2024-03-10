const User = require('../models/usermodel');

const protectRoute=async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token)
return res.status(401).json({message:"Unauthorized"}) ;
const decoded= jwt.verify(token,process.env.secureKey);
const user = await user;       
    } catch (error) {
       res.status(500).json({message:error.message}) 
       console.log("Error in middleware:",error.message);

    }
}