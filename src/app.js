const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

const {authMiddleware}= require('./middlewares/auth'); //importing the auth middleware from the middlewares folder

//middlewares 
app.use('/admin',authMiddleware); //applying the auth middleware to all routes starting with /admin


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
