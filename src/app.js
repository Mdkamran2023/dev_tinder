const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

//middlewares 
app.use('/admin',(req,res,next)=>{
    console.log("Admin middleware is running...");
    const token = "xyz123"; //dummy token for authentication
    const isAdminAuthorized= token === "xyz123"; //checking if the token is valid
    if(isAdminAuthorized){
        next(); //if authorized, proceed to the next middleware or route handler
    } else{
        res.status(403).send("Access denied. Admins only."); //if not authorized, send a 403 Forbidden response
    }
});

//routes
app.get("/admin/getAllUsers",(req,res)=>{
    res.send("List of all users..."); //sending a response with the list of all users
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("User deleted successfully..."); //sending a response indicating that the user has been deleted
});


app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
});
