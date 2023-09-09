import mongoose from "mongoose";

const UserSchema = mongoose.Schema(
    {
        firstName: { // Properties of firstname att of user
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        lastName: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true
        },
        password: {
            type: String,
            required: true,
            max: 50,
            min: 5
        },
        picturePath: {
            type: String,
            default: "",
        },
        userPictureUrl: {
            type: String,
            default: "",
        },

        friends: {
            type: Array,
            default: [],
        },
        chatIds: {
            type: Array, 
            default: []
        },
        location: String,
        occupation: String,
        viewedProfile: Number,
        impressions: Number,
        
    },
    { timestamps: true }
);

const User = mongoose.model("User", UserSchema)

export default User;