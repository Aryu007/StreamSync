import User from '../models/User.js';

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
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
        const user = await User.findById(req.user._id).
        select('friends')
        .populate('friends',"fullName profilePicture nativeLanguage learningLanguage location bio isOnboarded"); 

        res.status(200).json(user.friends);
    } 
    catch (error) {
        console.error('Error fetching friends:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}