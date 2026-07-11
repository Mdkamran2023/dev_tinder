const jwt = require("jssonwebtoken");
const {User} = require("../models/user");
const userAuth=async(req,res,next)=>{
    try{
        //read the token from the cookies
        const {token} = req.cookies;
    //check if the user is authenticated
    //if the token is not present, return an error
    if(!token){
        return res.status(401).json({message: "Unauthorized: No token provided .. Login to access this resource"});
    }
    const decoded= await jwt.verify(token,"DEVMANUS@123");
    //check if the user exists in the database
    const user= await User.findById(decoded._id); 
    if(!user){
        throw new Error("User not found");
    }
    //if the user is authenticated, attach the user object to the request object
    req.user=user;
    next();

}catch(err){
    res.status(401).json({message: "Unauthorized: Invalid token"});
}
}

module.exports={userAuth};
