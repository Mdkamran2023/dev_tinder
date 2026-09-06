const express = require("express"); //importing the express module
const { connectDB } = require("./config/database"); //importing the database configuration file
const app = express(); //creating an instance of express application
const cookieParser= require("cookie-parser"); //importing the cookie-parser module to parse cookies from the request headers

const authRouter= require("./routers/auth"); //importing the auth router
const profileRouter= require("./routers/profile"); //importing the profile router
const requestsRouter= require("./routers/requests"); //importing the requests router 
const {userRouter} = require("./routers/user"); //importing the user router



app.use(express.json()); //middleware to parse incoming JSON requests ,
//  this allows us to access the request body as a Javascript object in our route handlers.

//middleware to parse cookies from the request headers
app.use(cookieParser()); 

app.use("/", authRouter); //using the auth router for all routes starting with /auth
app.use("/", profileRouter); //using the profile router for all routes starting with /profile
app.use("/", requestsRouter); //using the requests router for all routes starting with /requests  
app.use("/", userRouter); //using the user router for all routes starting with /user


// after creating the express app, we need to connect to the database before strating the server.
//   We can do this by calling the connectDB function and then starting the server in the callback function of the promise returned by connectDB.
connectDB()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(7777, () => {
      console.log("Server is running on port 7777 ...");
    });
  })
  .catch((err) => {
    console.log("Error connecting to database: ", err);
  });
