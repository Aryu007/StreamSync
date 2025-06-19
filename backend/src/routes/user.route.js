import express from 'express';
import {protectRoute} from '../middleware/auth.middleware.js';
import {getRecommendedUsers, getMyFriends, 
        sendFriendRequest, acceptFriendRequest, 
        getFriendRequests, outgoingFriendRequests} from '../controllers/user.controller.js';

const router = express.Router();
// apply the protectRoute middleware to all routes in this router
router.use(protectRoute);


router.get('/', protectRoute, getRecommendedUsers);
router.get('/friends', protectRoute, getMyFriends);

router.post('/friend-request/:id',sendFriendRequest);
router.put('/friend-request/:id/accept',acceptFriendRequest);

router.get('/friends/requests', getFriendRequests);
router.get('/outgoing-friend-requests', outgoingFriendRequests);

export default router;