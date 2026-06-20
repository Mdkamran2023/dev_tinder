const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

// app.get("/getUserData",(req,res)=>{
//     throw new Error("This is a test error");
//     res.send("User data fetched successfully");
// });

app.get("/getUserData",(req,res,next)=>{
    try{
        throw new Error("This is a test error");
        res.send("User data fetched successfully");
    }
    catch(err){
        res.status(500).send("Internal Server Error: "+err.message);    
    }
})

// wildcard route to handle errors
app.use("/",(err,req,res,next)=>{
    res.status(500).send("Internal Server Error: "+err.message);
});






app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
});
