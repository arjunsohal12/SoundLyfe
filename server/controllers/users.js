import User from "../models/user.js";
import { getImageURL } from "./imgProcess.js";

/* READ */

export const getUser = async (req, res) => {
    try{
        const {id} = req.params
        const user = await User.findById(id);
        res.status(200).json(user);

    }
    catch (err) {

        res.status(404).json({error: err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try{
        const {id} = req.params
        const user = await User.findById(id);
        const friends = await Promise.all(
            user.friends.map((id) => {
                return User.findById(id)
            })
        );
        // const friendURLS = await Promise.all(friends.map(async(friend) => {
        //     const pictureURL = getImageURL(friend)
        //     return pictureURL
        // }))
        // console.log(friendURLS)
        const formattedFriends = await Promise.all(friends.map(
             async (friend) => {
              return { _id:friend._id, firstName:friend.firstName, lastName:friend.lastName, occupation:friend.occupation, location:friend.location
                , picturePath:friend.picturePath, userPictureUrl: friend.userPictureUrl }}))

        res.status(200).json(formattedFriends);
    }
    catch (err){
        console.log(err)
        res.status(404).json({error: err.message});
    }
}


/* UPDATE */

export const addRemoveFriend = async (req, res) => {

    try{
        const {id, friendId} = req.params
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) { // remove
            user.friends = user.friends.filter((id) => id !== friendId); // Can optimize maybe? Better algorithm to remove?
            friend.friends = friend.friends.filter((idz) => idz !== id);
        } 
        else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => {
                return User.findById(id)
            })
        );

        const formattedFriends = friends.map(
            ({_id, firstName, lastName, occupation, location, picturePath, userPictureUrl }) =>  {
                return {_id, firstName, lastName, occupation, location, picturePath, userPictureUrl }
            })
        res.status(200).json(formattedFriends);

    }
    catch (err) {
        console.log(err)
        res.status(404).json({error: err.message});
    }
}


export const searchUser = async (req, res) => {
    try {
        const {userEmail, userName} = req.params;
        var user = null
        if (userName != null) {
            user = await User.find({userName: userName})
        }
        else {
            user = await User.find({email: userEmail});
        }

        if (user == null) {
            res.status(404)
        }
        else {
            res.status(200).json(user)
        }
    }
    catch (err) {
        res.status(404).json({error: err.message})
    }


}
