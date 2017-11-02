const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const {
  ensureAuthenticated
} = require('../helpers/auth');

router.get('/', (req, res) => {
  Post.find({status: "Public"})
  .populate('user')
  .then(posts => {
    res.render('posts/index', {posts: posts});
  });
});

router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('posts/add');
});

router.post('/', (req, res) => {
  let allowComments = req.body.allowComments ? true : false;

  const newPost = {
    title: req.body.title,
    status: req.body.status,
    body: req.body.body,
    allowComments: allowComments,
    user: req.user.id
  }

  new Post(newPost)
  .save()
  .then(post => {
    res.redirect(`/posts/show/${post.id}`);
  });
});

module.exports = router;
