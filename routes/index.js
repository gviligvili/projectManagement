"use strict"
var express = require('express');
var router = express.Router();
const nycPopulations = require("./nycPopulations");

/* GET home page. */

router.get('/', function(req, res) {
  res.send({ title: 'Express' });
});

router.get('/nycpop', nycPopulations)
module.exports = router;
