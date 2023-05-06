const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/signin', (req, res) => {
  res.render('signin');
});

router.get('/entrace', (req, res) => {
  res.render('entrace');
});

module.exports = router;
