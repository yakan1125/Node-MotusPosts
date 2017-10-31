// required modules
const express = require('express');
const mongoose = require('mongoose');


// define app as express
const app = express();

// define the root path of the app
app.get('/', (req, res) => {
  res.send('ROOT');
});

// define conditional port PROD || DEV
const port = process.env.PORT || 5000;


// start server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
