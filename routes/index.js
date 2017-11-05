const express = require('express');
const router = express.Router();
const {ensureAuthenticated, ensureGuest} = require('../helpers/auth');
const mongoose = require('mongoose');
const Post = mongoose.model('posts');

module.exports = router;

// define the root path of the app
router.get('/', ensureGuest, (req, res) => {
  res.render('index/welcome');
});

router.get('/about', (req, res) => {
  res.render('index/about');
});

router.get('/dashboard', ensureAuthenticated,  (req, res) => {
  Post.find({user: req.user.id})
  .then(posts => {
    res.render('index/dashboard', {
      posts: posts
    });
    
  });
  
});
