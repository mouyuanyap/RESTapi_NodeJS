const express = require('express');
const router = express.Router();
const building = require('../services/getBuilding');
const authorize = require('../_middleware/authorize');
const fs = require('fs');
const { response } = require('express');


router.get('/',authorize(),async function(req, res, next) {
  console.log(req.header['Accept'])
  
  if (req.header('Accept').includes('application/json')){
        try {
      res.json(await building.getMultiple());
    } catch (err) {
      console.error(`Error while getting quotes `, err.message);
      next(err);
    }
  }else{
    
    res.render('all_building', { title:JSON.stringify((await building.getMultiple()).Buildings)})
  }
  
});


router.get('/get/:id',  authorize(),async function(req, res, next) {
  try {
    res.json(await building.getOneBuilding(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id', authorize(), async function(req, res, next) {
  try {
    res.json(await building.getSpecific(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/filterBlock/:id', authorize(), async function(req, res, next) {
  try {
    res.json(await building.getMultipleFilterBlock(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/filterFloor/:id',  authorize(),async function(req, res, next) {
  try {
    res.json(await building.getMultipleFilterFloor(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/filterAll/:block/:floor', authorize(),async function(req, res, next) {
  try {
    res.json(await building.getMultipleFilterAll(req.params.block,req.params.floor));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id/usage',  authorize(),async function(req, res, next) {
  try {
    res.json(await building.getUsage(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id/usageAvg', authorize(),async function(req, res, next) {
  try {
    res.json(await building.getUsageAvg(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});


router.post('/:id', async function(req, res, next) {
  try {
    console.log(req.body)
    res.json(await building.insert(req.body));
  } catch (err) {
    console.error(`Error while getting quotes??? `, err.message);
    next(err);
  }
});

module.exports = router;