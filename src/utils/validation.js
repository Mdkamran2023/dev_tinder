const validator= require("validator");

const validateSignUpData =(req)=>{
    const{firstName,lastName,emailId,password}= req.body;   //destructuring the request body to get the required fields
    if(!firstName || !lastName || !emailId || !password){
        return {
            isValid: false,
            message: "All fields are required"
        };
    }
    if(!validator.isEmail(emailId)){
        return {
            isValid: false,
            message: "Invalid email format"
        };
    }
    if(password.length < 6 || !validator.isStrongPassword(password)){
        return {
            isValid: false,
            message: "Password must be at least 6 characters long and include a mix of uppercase, lowercase, and numbers"
        };
    }
    return {
        isValid: true,
        message: "Data is valid"
    };  
}

const validateLoginData =(req)=>{
    const {emailId} =req.body; //destructuring the request body to get the emailId
    if(!validator.isEmail(emailId)){
        return{
            isValid:false,
            message:"Invalid email format"
        }
    }
    else if(!req.body.password || req.body.password.length < 6){
        return{
            isValid:false,
            message:"Password must be at least 6 characters long"
        }
    }   
    else if(!req.body.emailId || !req.body.password){
        return{
            isValid:false,      
            message:"Email and password are required"
        }
    }   
    else if(!validator.isStrongPassword(req.body.password)){
        return{
            isValid:false,      
            message:"Password must include a mix of uppercase, lowercase, and numbers"
        }
    }
    return{
        isValid:true,
        message:"Data is valid"
    }
}

module.exports={validateSignUpData, validateLoginData};


