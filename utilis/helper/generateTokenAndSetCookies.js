const jwt = require('jsonwebtoken');

 const generateTokenAndSetCookies=(userId,res)=>{

  const token =jwt.sign({userId},"secureKey" );

  res.cookie("jwt" , token, {
    httpOnly:true,
    maxAge:15*24*60*60*1000,
    sameSite:"strict"
  })
  return res.cookie.jwt;


}

module.exports=generateTokenAndSetCookies;

