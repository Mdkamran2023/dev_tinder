const mongoose= require("mongoose");
const {User}= require("./user");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', //reference to the User model, this allows us to populate the user details when fetching connection requests
        required:true,
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    status:{
        type:String,
        required:true,
        enum:{
            values:['ignored', 'interested', 'accepted', 'rejected'],
            message:`{VALUE} is not a valid status. Valid statuses are: ignored, interested, accepted, rejected`
        }
    }

},{timestamps:true});

// compound indexing for querying faster
connectionRequestSchema.index({
    fromUserId:1,
    toUserId:1
});

/**
 * Async Pre-save middleware hook.
 * Executes automatically before saving a connection request document.
 */
connectionRequestSchema.pre('save', async function() {
    const connectionRequest = this;

    // Business Logic: Prevent users from sending a connection request to themselves
    if (connectionRequest.fromUserId.toString() === connectionRequest.toUserId.toString()) {
        throw new Error("You cannot send a connection request to yourself");
    }

    // Note: Because this function is 'async', it implicitly returns a Promise.
    // Mongoose automatically waits for this Promise to resolve before proceeding to save.
    // Throwing an error rejects the Promise, stopping the save operation.
});


const ConnectionRequestModel = mongoose.model("ConnectionRequestModel", connectionRequestSchema);

module.exports = {ConnectionRequestModel};
