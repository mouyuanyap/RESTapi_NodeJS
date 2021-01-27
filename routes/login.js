const express = require('express');
const router = express.Router();

module.exports = router;

router.get('/',async function(req, res, next) {
    console.log(req.header['Accept'])
    
    res.render('index')
    
    
  });