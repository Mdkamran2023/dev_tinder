const mongoose= require('mongoose');

const connectDB= async()=>{
    await mongoose.connect("mongodb+srv://mdkamran0109_db_user:qwertyuiop123@namastekamnode.mhimqid.mongodb.net/dev_tinder");
}

// connectDB().then(()=>{
//     console.log("Connected to MongoDB successfully");
// }).catch((err)=>{
//     console.log("Error connecting to MongoDB: ",err);
// });

module.exports= {
    connectDB
}
