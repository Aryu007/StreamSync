import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user.id;
    const currentUser = req.user; 
    if(!currentUser) {
      return res.status(404).json({ message: 'Current user not found' });
    }

    const recommendedUsers = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        { $id: { $nin : currentUser.friends} }, // Exclude friends of the current user
        { isOnboarded : true } 
      ]
    }); 

    res.status(200).json(recommendedUsers);
  } 
  catch (error) {
    console.error('Error fetching recommended users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getMyFriends(req, res) {
    try {
        const myId = req.user.id;
        const { id : recipientId } = req.params;
        
        // prevent sending friend request to self
        if(myId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        if( recipient.friends.includes(myId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // check if a friend request already exists
        const existingRequest = await User.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ]
        });
        if(existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        // create a new friend request
        const newFriendRequest = new FriendRequest({
            sender: myId,
            recipient: recipientId
        });
        res.status(201).json(newFriendRequest);
    } 
    catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function sendFriendRequest(req, res) {
    try {
        const {id : recipientId} = req.params;
        const senderId = req.user.id;

        // prevent sending friend request to self
        if(senderId === recipientId) {
            return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient not found' });
        }

        // check if a friend request already exists
        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: senderId, recipient: recipientId },
                { sender: recipientId, recipient: senderId }
            ]
        });
        if(existingRequest) {
            return res.status(400).json({ message: 'Friend request already exists' });
        }

        // create a new friend request
        const newFriendRequest = new FriendRequest({
            sender: senderId,
            recipient: recipientId,
            status: 'pending'
        });

        await newFriendRequest.save();
        
        res.status(201).json(newFriendRequest);
    }
    catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id : requestId} = req.params;
        const request = await FriendRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ message: 'Friend request not found' });
        }

        // Check if the current user is the recipient of the request
        if (request.recipient.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to accept this friend request' });
        }

        request.status = 'accepted';
        await request.save();

        // add each user to the other's friends list
        await User.findByIdAndUpdate(request.sender, {
            $addToSet: { friends: request.recipient }
        });

        await User.findByIdAndUpdate(request.recipient, {
            $addToSet: { friends: request.sender }
        });

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } 
    catch (error) {
        console.error('Error accepting friend request:', error);
        res.status(500).json({ message: 'Internal server error' }); 
    }
}

export async function getFriendRequests(req,res){
    try {
        const incomingRequests = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: 'pending' 
            })
            .populate('sender', 'fullName profilePicture nativeLanguage learningLanguage'); // Populate sender details

        const acceptedRequests = await FriendRequest.find({ 
            recipient: req.user.id, 
            status: 'accepted' 
            })
            .populate('sender', 'fullName profilePicture'); // Populate sender details

        res.status(200).json({
            incomingRequests,
            acceptedRequests
        });
    } 
    catch (error) {
        console.error('Error fetching friend requests:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function outgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({ 
            sender: req.user.id, 
            status: 'pending' 
        }).populate('recipient', 'fullName profilePicture nativeLanguage learningLanguage'); // Populate recipient details

        res.status(200).json(outgoingRequests);
    } 
    catch (error) {
        console.error('Error fetching outgoing friend requests:', error);
        res.status(500).json({ message: 'Internal server error' });    
    }
}