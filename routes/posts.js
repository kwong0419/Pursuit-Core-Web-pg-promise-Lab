var express = require("express");
var router = express.Router();
const { db } = require("../db/db.js");

router.get("/all", async (req, res) => {
  res.json({
    posts: await db.any(
      "SELECT * FROM posts INNER JOIN users ON posts.poster_id = users.id"
    ),
    message: "Successfully got all posts",
    timestamp: new Date().toString()
  });
});

router.get("/:user_id", async (req, res) => {
  let { user_id } = req.params;
  let userPosts = await db.any(
    "SELECT * FROM posts INNER JOIN users ON posts.poster_id = users.id WHERE poster_id = $1",
    user_id
  );
  if (userPosts.length) {
    res.json({
      posts: userPosts,
      message: "All posts successfully retrieved",
      timestamp: new Date().toString()
    });
  } else {
    res.json({
      error: "No found by that user",
      timestamp: new Date().toString()
    });
  }
});

router.post("/register", async (req, res) => {
  let { poster_id, body } = req.body;
  let post = await db.one(
    "INSERT INTO posts (poster_id, body) VALUES ($1, $2) RETURNING *",
    [poster_id, body]
  );
  res.json({
    post,
    message: "Successfully registered a post",
    timestamp: new Date().toString()
  });
});

module.exports = router;
