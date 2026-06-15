const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

// request handling
// app.get() is used to define a route handler for GET requests to the specified path
// here sequence matters, if we put the "/" route handler before the "/about" route handler,
// then the "/about" route handler will never be reached because the "/" route handler will match all requests,including the "/about" request,
//  and will send the response "Hello world" for all requests,including the "/about" request. 
// Therefore, it's important to define the more specific route handlers before the more general ones to ensure that the correct handler is executed for each request.

app.get("/about",(req,res)=>{
    res.send("THis is the about get page")
});

app.post("/about",(req,res)=>{
    res.send({firstname:"kammran",lastname:"shahzad"});
});

app.delete("/about",(req,res)=>{
    res.send("This is the about delete page");
});

app.put("/about",(req,res)=>{
    res.send("This is the about put page");
}); 

app.patch("/about",(req,res)=>{
    res.send("This is the about patch page");
});

app.get("/ab*cd",(req,res)=>{
    res.send("This is the about wildcard page");
});



//dynamic route parameters
app.get("/user/:id/:name/:password",(req,res)=>{
    console.log("User ID: " + req.params.id);
    console.log("User Name: " + req.params.name);
    console.log("User Password: " + req.params.password);
    res.send("This is the user page with dynamic route parameters");
});

// query parameters
app.get("/user",(req,res)=>{
    console.log(req.query);
    res.send("This is the user page");
});

app.use("/about",(req,res)=>{
    res.send("This is the about page");
});


app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
});
