const db = require('./db');

async function getMultiple(){
  const Buildings = await db.query(`
  SELECT * FROM c180_property.propertyunits;
  `);

  return {
    Buildings
  }
}

async function getOneBuilding(id){
  const Buildings = await db.query(`
  SELECT * FROM c180_property.propertyunits WHERE UnitID = ?;
  `,)[id];

  return {
    Buildings
  }
}

async function getMultipleFilterBlock(block){
  const Buildings = await db.query(`
  SELECT * FROM c180_property.propertyunits WHERE UnitBlock = ?;
  `,[block]);

  return {
    Buildings
  }
}

async function getMultipleFilterFloor(floor){
  const Buildings = await db.query(`
  SELECT * FROM c180_property.propertyunits WHERE UnitFloor = ?;
  `,[floor]);

  return {
    Buildings
  }
}

async function getMultipleFilterAll(block,floor){
  console.log(block)
  console.log(floor)
  const Buildings = await db.query(`
  SELECT * FROM c180_property.propertyunits WHERE UnitBlock = ? AND UnitFloor = ?;
  `,[block,floor]);

  return {
    Buildings
  }
}


async function getSpecific(id){
  const Records = await db.query(`
  SELECT RecordID, RecordTime, UserName,RecordPropertyID,UnitBlock,UnitFloor,UnitName,RecordReading 
  FROM c180_property.watermeterrecord JOIN c180_property.propertyunits JOIN c180_property.authusers 
  WHERE watermeterrecord.RecordPropertyID = propertyunits.UnitID AND RecordPropertyID = ?
  AND authusers.id = watermeterrecord.RecordUserID
  ORDER BY RecordTime DESC LIMIT 12;
  `,[id]);

  return {
    Records
  }
}

async function getUsage(id){
  const Usage = await db.query(`
  SELECT * FROM c180_property.waterusage WHERE UsagePropertyID = ?
  ORDER BY PeriodEnd DESC LIMIT 1;
  `,[id]);

  return {
    Usage
  }
}

async function getUsageAvg(id){
  const UsageAvg = await db.query(`
  SELECT usagePropertyID, AVG(UsageData) as AverageUsage FROM c180_property.waterusage WHERE usagePropertyID = ? GROUP BY usagePropertyID;;
  `,[id]);

  return {
    UsageAvg
  }
}


function validateAddBuilding(quote) {
  let messages = [];

  console.log(quote);

  if (!quote) {
    messages.push('No object is provided');
  }

  if (!quote.UnitBlock) {
    messages.push('UnitBlock is empty');
  }

  if (!quote.UnitName) {
    messages.push('UnitName is empty');
  }

  if (!quote.UnitFloor) {
    messages.push('UnitFloor is empty');
  }

  if (!quote.LastRecordTime) {
    messages.push('LastRecordTime is empty');
  }
  


  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}



function validateCreate(quote) {
  let messages = [];

  console.log(quote);

  if (!quote) {
    messages.push('No object is provided');
  }

  if (!quote.SubmitReading) {
    messages.push('Quote is empty');
  }

  if (!quote.SubmitRecordID) {
    messages.push('Quote is empty');
  }

  
  if (messages.length) {
    let error = new Error(messages.join());
    error.statusCode = 400;

    throw error;
  }
}

async function insert(quote){
  validateCreate(quote);

  const result = await db.query(
    'INSERT INTO WaterMeterRecord(RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values(?,?,?,"Pending");;', 
    [quote.SubmitUserID,quote.SubmitRecordID, quote.SubmitReading]
  );

  let message = 'Error in creating quote';

  if (result.affectedRows) {
    message = 'Quote created successfully';
  }

  return {message};
}

async function verifyRecord(quote){
  if (!quote) {
    console.log('No object is provided');
  }

  if (!quote.id) {
    console.log('id is empty');
  }

  const result = await db.query(
    'UPDATE propertyunits SET RecordStatus = "Verified" WHERE UnitID = ?;', 
    [quote.id]
  );

  let message = 'Error in creating quote';

  if (result.affectedRows) {
    message = 'Quote created successfully';
  }

  return {message};
}

async function addBuilding(quote){
  validateAddBuilding(quote);

  const result = await db.query(
    'INSERT INTO PropertyUnits(UnitBlock,UnitFloor,UnitName,LastRecordTime,PreviousRecordReading,CurrentRecordReading) Values (?,?,?,"2020-11-05",0,0);', 
    [quote.UnitBlock,quote.UnitFloor, quote.UnitName]
  );

  let message = 'Error in creating quote';

  if (result.affectedRows) {
    message = 'Quote created successfully';
  }

  return {message};
}


module.exports = {
  getMultiple,
  getSpecific,
  insert,
  getUsage,
  getUsageAvg,
  getMultipleFilterBlock,
  getMultipleFilterFloor,
  getMultipleFilterAll,
  getOneBuilding,
  addBuilding,
  verifyRecord
}
