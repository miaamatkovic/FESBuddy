import express from "express";
import { getPosts, getPostsByCourse, createPost, updatePost, deletePost } from "../controllers/post.js";

const router = express.Router();

router.get("/find/:userId", getPosts);
router.get("/course/:courseName", getPostsByCourse);
router.post("/create", createPost);
// PUT and DELETE require ownership checks implemented in `updatePost` and `deletePost` controllers
router.put("/:id", updatePost);
router.delete("/:id", deletePost);

export default router;
