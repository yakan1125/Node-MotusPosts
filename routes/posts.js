const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const {
  ensureAuthenticated
} = require('../helpers/auth');


// read posts from DB
router.get('/', (req, res) => {
  Post.find({
      status: "Public"
    })
    .populate('user')
    .sort({
      date: 'desc'
    })
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      })
    });
});

// get posts  for my route
router.get('/my', ensureAuthenticated, (req, res) => {
  Post.find({
      user: req.user.id
    })
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    });
});

// get posts from specific user
router.get('/user/:userId', (req, res) => {
  Post.find({
      user: req.params.userId,
      status: 'Public'
    })
    .populate('user')
    .then(posts => {
      res.render('posts/index', {
        posts: posts
      });
    });
});

router.get('/show/:id', (req, res) => {
  Post.findOne({
      _id: req.params.id

    })
    .populate('user')
    .populate('comments.commentUser')
    .then(post => {
      if (post.status == 'Public') {
        res.render('posts/show', {
          post: post
        });
      } else {
        if (req.user) {
          if (req.user.id == post.user._id) {
            res.render('posts/show', {
              post: post
            });
          } else {
            res.redirect('/posts');
          }
        } else {
          res.redirect('/posts');
        }
      }
    });
});

// add post form Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('posts/add');
});


// edit post form route
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      if (post.user != req.user.id) {
        res.redirect('/posts')
      } else {
        res.render('posts/edit', {
          post: post
        })
      }
    });
});


// insert new post into DB
router.post('/', ensureAuthenticated, (req, res) => {
  let allowComments = req.body.allowComments ? true : false;
  const newPost = {
    title: req.body.title || 'No Title Given',
    status: req.body.status,
    body: req.body.body || '<p>No Content Provided</p>',
    allowComments: allowComments,
    user: req.user.id
  }
  new Post(newPost)
    .save()
    .then(post => {
      res.redirect(`/posts/show/${post.id}`);
    });
});


// duplictae post
router.post('/duplicate/:id', ensureAuthenticated, (req, res) => {
  Post.findOne({
      _id: req.params.id
    })
    .then(post => {
      const newPost = {
        title: post.title + '-Copy',
        status: post.status,
        body: post.body,
        allowComments: post.allowComments,
        user: post.user,
        date: Date.now()
      }
      new Post(newPost)
        .save()
        .then(post => {
          res.redirect('/dashboard');
        });
    });
});

// add a comment to the posts collection
router.post('/comment/:id', (req, res) => {
  Post.findOne({
    _id: req.params.id
  }).then(post => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };
    post.comments.unshift(newComment);
    post.save().then(() => {
      res.redirect(`/posts/show/${post.id}`);
    })
  })
})

// edit form insert into DB
router.put('/:id', ensureAuthenticated, (req, res) => {
  Post.findOne({
    _id: req.params.id
  }).then(post => {
    let allowComments = req.body.allowComments ? true : false;
    post.title = req.body.title || 'No Title Given';
    post.body = req.body.body || '<p>No Content Provided</p>';
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.save()
      .then(() => {
        res.redirect(`/dashboard`);
      });
  })
});

// delete post
router.delete(`/:id`, ensureAuthenticated, (req, res) => {
  Post.remove({
      _id: req.params.id
    })
    .then(() => {
      res.redirect('/dashboard');
    })
})

module.exports = router;