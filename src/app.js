const express = require('express'); //importing the express module
const {connectDB}=require('./config/database'); //importing the database configuration file
const app= express(); //creating an instance of express application
const {User}= require('./models/user'); //importing the user model

app.post('/signup', async(req,res)=>{
   
        //creating a new user instance using the user model 
        const userInstance= new User({
            firstName:"shaya",
            lastName:"Sharmi",
            emailId:"akshay.sharma@gmail.com",
            password:"password123"
        });
         try{
        //saving the user instance to the database
        await userInstance.save();
        res.status(201).send("User created successfully"); //sending a success response
    } catch(err){
        console.log("Error creating user:",err);
        res.status(500).send("Internal server error"); //sending an error response in case of failure
    }
});


// after creating the express app, we need to connect to the database before strating the server.
//   We can do this by calling the connectDB function and then starting the server in the callback function of the promise returned by connectDB.
connectDB().then(()=>{
    console.log("Database connected successfully");
    app.listen(7777,()=>{
    console.log("Server is running on port 7777 ...");
})
}).catch((err)=>
{
    console.log("Error connecting to database: ",err);
});


