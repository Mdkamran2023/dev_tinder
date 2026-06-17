const express = require('express'); //importing the express module
const app= express(); //creating an instance of express application

app.use("/user", (req, res, next) => {
    console.log("Handler 1: user route");
    // Send the response here. After `res.send()` the response is finished.
    // Calling `next()` after `res.send()` will still invoke the next middleware,
    // but you must NOT send another response there (that would throw an error).
    // Choose one pattern:
    // - Send here and do NOT call `next()` to end the chain.
    // - Or call `next()` without sending here and let a later middleware send.
    // For cleanup or logging after the response is sent, use `res.on('finish', ...)`.
    res.send("Hello from user route");
    next(); // allowed but avoid sending again in downstream handlers
}, (req, res, next) => {
    console.log("Handler 2: user route");
    // This middleware runs only if the previous handler called `next()`.
    // Do not call `res.send()` here if the previous handler already sent a response.
    if (!res.headersSent) {
        res.send("This is the second for user route");
    }
});


app.get("/aboutuser",(req,res,next)=>{
    console.log("Handler 2: aboutuser route");
    // res.send("This is the second for aboutuser route"); 
    // next();// allowed but avoid sending again in downstream handlers
});

app.get("/aboutuser",(req,res,next)=>{
    console.log("Handler 1: aboutuser route");
    res.send("Hello from aboutuser route");
    next(); // allowed but avoid sending again in downstream handlers
});



app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
});
