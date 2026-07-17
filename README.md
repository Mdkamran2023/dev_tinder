* Add the express.json middleware to your app for parsing json .
* make a signup API dynamic to receive data from the end user.
* route to get user data based on emailId
* feed API - Get /feed all the users from the database
  
* EPISODE-08:  Data Sanitazation and Schema Validations
* explore Mongoose schema type options in the documentation to choose the best field types for users
* add `lowercase`, `trim`, `min`, and `minlength` validations on schema fields where applicable
* define default values for optional fields so records are more predictable when data is missing
* create a custom `gender` validator that only accepts valid values like `male`, `female`, `other`, or `prefer not to say`
* improve the DB schema by adding proper validation on every user field, including required flags and format checks
* enable `timestamps: true` on the `userSchema` so `createdAt` and `updatedAt` are managed automatically
* Data Sanitization- Add API level validation on Patch request and signup POST API
* Add API Validation for each field 
* Install validator
* Explore validator Library function and use `validator` function for `password`,`email` ....
* NEVER TRUST REQ.BODY (IT CAN COME WITH MALICIOUS THINGS)
  
* validate data in SIGNUP API
* Install bcrypt library
* Create hashedPassword using bcrypt.hash(password, saltRounds)  and save the user with hashed password
* login API and writes authentication code too


* install cookie-parser
* just send a dummy cookie to user
* create GET /profile API and check if you get the cookie back
* install jsonwebtoken
* IN /login API, after email and password validation, create a JWT token and send it to user in cookies 
* read the cookies inside your profile API find the logged in USER
* userAuth Middleware
* Add the userAuth middleware in profile API and a new sendConnectionRequest API
* set thr expiry of JWT token and cookies ..
* create userSchema method to getJWT()
* create userSchema method to comparepassword(passwordInputByUser)
