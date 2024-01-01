import  Express  from "express";
import { getUser,updateUser,getLikedPosts } from "../controllers/user.js";

const router = Express.Router();

router.get('/find/:userId',getUser);
router.put('/',updateUser);
router.get('/likedPosts', getLikedPosts);

export default router;