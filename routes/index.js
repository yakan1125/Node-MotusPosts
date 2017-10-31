const express = require('express');
const router = express.Router();

module.exports = router;

// define the root path of the app
router.get('/', (req, res) => {
  res.render('index/welcome');
});

router.get('/dashboard',  (req, res) => {
  res.send('Dashboard');
});
