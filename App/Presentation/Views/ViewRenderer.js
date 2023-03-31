const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('LogIn');
});

router.get('/signin', (req, res) => {
  res.render('SignIn');
});

router.get('/entrace', (req, res) => {
  res.render('Entrace');
});

module.exports = router;
