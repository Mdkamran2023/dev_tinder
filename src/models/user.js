const mongoose= require('mongoose');
const validator=require('validator');
const jwt =require('jsonwebtoken');
const bcrypt=require('bcrypt');

const userSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minlength:4,
        maxlength:50 
    },
    lastName:{
        type:String,
        required:true
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true, 
        trim:true,
        validate(value){
            validator.isEmail(value) ?true: new Error("Invalid email address");//using validator library to check if the email is valid or not
        }
    },
    password:{
        type:String,
        required:true,
        minlength:6,
        validate(value){
            if(!validator.isStrongPassword(value,{minLength:6,minLowercase:1,minUppercase:1,minNumbers:1,minSymbols:0})){
                throw new Error("Password is not strong enough");
            }
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    skills:{
    type:[String]
    },
    about:{
        type:String,
        default:"Accessing profile"
    },
    age:{
        type:Number,
        min:18 
    },
    gender:{
        type:String,
        validate(value){
        if (!['male','female','other','prefer not to say'].includes(value)){
            throw new Error("Gender not identified");
        }
        }
    }
    // createdAt:{
    //     type:Date,
    //     default:Date.now
    //     }
},{timestamps:true});
 
userSchema.methods.getJWTToken = async function(){ //didn't use arrow function because we can't access this without it
    const user =this;
    const token = await jwt.sign({_id:user._id},"DEVMANUS@!@#",{expiresIn:"1d"})
;

return token;}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user =this;
    const hashedPassword = user.password;
    const isPasswordValid= await bcrypt.compare(passwordInputByUser,hashedPassword);

    return isPasswordValid;
}


const User=mongoose.model('User',userSchema);

module.exports={User};
