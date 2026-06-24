const express = require('express'); //importing the express module
const {connectDB}=require('./config/database'); //importing the database configuration file
const app= express(); //creating an instance of express application
const {User}= require('./models/user'); //importing the user model


 app.use(express.json()); //middleware to parse incoming JSON requests ,
//  this allows uss to access the request body as a Javascript object in our route handlers.

//route to get user data based on emailId
app.get('/user',async(req,res)=>{
    const userEmail= req.body.emailId; //getting the emailId from the request body
    try{
    const users= await User.findOne({emailId: userEmail}).exec(); 
    //if the user is not found, send a 404 Not Found response, else send the user data as a response

    console.log("User data fetched successfully: ",users);
    if(!users){
        res.status(404).send("No user found with the provided emailId");//if no user is found, send a 404 Not Found response
    }
    else{
        res.send(users); 
    }
    
    }catch(err){
        res.status(500).send("Error fetching user data: ",err);
    };
    
});

//route to delete user data based on userId
app.delete('/user',async(req,res)=>{
    const userId= req.body.userId; //getting the userId from the request body
    try{
        const deletedUser= await User.findByIdAndDelete({_id:userId});
        if(!deletedUser){
            res.status(404).send("No user found with the provided userId");//if no user is found, send a 404 Not Found response
        }else{
            res.send({message: "User deleted successfully", deletedUser});
        }

    }catch(err){
        res.status(500).send("Error deleting user data:",err);
    }
})

//route to update user data based on userId
app.patch("/user",async(req,res)=>{
    const userId= req.body.userId; // getting the userId
    const updateData=req.body; // getting the data to be updated
    try{
        const updateUser= await User.findByIdAndUpdate({_id:userId},updateData,{returnDocument:"after"}); //updating the user data and returning the updated document
        console.log(updateUser);
        if(!updateUser){
            res.status(404).send("No user found with the provided userId");//if no user is found,send a 404 Not Found response
        }
        else{
            res.send({message: "User updated successfully", updateUser}); //sending a success response with the updated user data
        }
    }catch(err){
        res.status(500).send("Internal Server error");
    }
})

//feed API - Get /feed all the users from the database
app.get('/feed', async(req,res)=>{
    const users= await User.find({});
    try{

        if(users.length === 0){
            res.status(404).send("No users found in the database");//if no user is found, send a 404 Not Found response
        }
        else{
            res.send(users)
        }

    }catch(err){
        res.status(500).send("Error fetching user data: ",err);
    }
})

app.post('/signup', async(req,res)=>{

    console.log(req.body);//logging the request body to the console for debugging purposes
   
        //creating a new user instance using the user model 
        const userInstance= new User(req.body);
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


