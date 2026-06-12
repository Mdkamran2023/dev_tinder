const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

// request handling
// app.get() is used to define a route handler for GET requests to the specified path
app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.get("/about",(req,res)=>{
    res.send("This is the about page");
});

app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
});
