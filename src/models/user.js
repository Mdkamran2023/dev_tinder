const mongoose= require('mongoose');

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
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    photoUrl:{
        type:String,
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

const User=mongoose.model('User',userSchema);

module.exports={User};
