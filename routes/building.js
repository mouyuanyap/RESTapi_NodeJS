const express = require('express');
const router = express.Router();
const building = require('../services/getBuilding');


router.get('/', async function(req, res, next) {
  try {
    res.json(await building.getMultiple());
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id', async function(req, res, next) {
  try {
    res.json(await building.getSpecific(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id/usage', async function(req, res, next) {
  try {
    res.json(await building.getUsage(req.params.id));
  } catch (err) {
    console.error(`Error while getting quotes `, err.message);
    next(err);
  }
});

router.get('/:id/usageAvg', async function(req, res, next) {
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