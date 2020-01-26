var express = require("express");
var router = express.Router();

const { getAllPosts, getUserPosts, createPost } = require("../queries/posts");

router.get("/all", getAllPosts);

router.get("/:user_id", getUserPosts);

router.post("/register", createPost);

module.exports = router;
