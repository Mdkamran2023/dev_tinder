const authMiddleware= (req,res,next)=>{
    console.log("Admin middleware is running...");
    const token="xyz@123"; //dummy token for authentication
    const isAdminAuthorized= token ==="xyz@123"; //checking if the token is valid
    if(isAdminAuthorized){
        next(); //if authorized, proceed to the next middleware or route handler
    } else{
        res.status(403).send("Access denied. Admins only."); //if not authorized, send a 403 Forbidden response
    }
}

module.exports={authMiddleware};
