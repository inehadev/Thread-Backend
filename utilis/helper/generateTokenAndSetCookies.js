const jwt = require('jsonwebtoken');

 const generateTokenAndSetCookies=(userId,res)=>{

  const token =jwt.sign({userId},"x-auth-token" );

  res.cookie("jwt" , token,    {
    httpOnly:true,
    path: '/',
    maxAge:90*24*60*60*1000,
    sameSite:"strict"
  })
  return res.cookie.jwt;
 

}

module.exports=generateTokenAndSetCookies;

