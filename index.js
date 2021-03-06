const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const router = require('./config/router');

const { dbURI, port } = require('./config/environment');

const app = express();
app.use(express.static(`${__dirname}/public`));

mongoose.connect(dbURI);
app.use(bodyParser.json());

app.use('/api', router);

app.use('/*', (req, res) => res.sendFile(`${__dirname}/public/index.html`));

app.use((err, req,res,next) => {
  //can find the err.name and err.message by doing console.log(err)
  if (err.name === 'ValidationError') res.status(422).json({ message: err.message });
  res.status(500).json({ message: 'Internal Server Error '});
  next();
});

app.listen(port, () => console.log(`port set up ${port}`));

module.exports = app;
