DROP DATABASE C180_Property;
CREATE SCHEMA C180_Property;

USE C180_Property;



CREATE TABLE PropertyUnits(
UnitID INTEGER(4) unsigned zerofill NOT NULL AUTO_INCREMENT,
UnitBlock CHAR(1),
UnitFloor CHAR(2),
UnitName CHAR(3),
PRIMARY KEY(UnitID)
);

CREATE TABLE Users (
    UserID INTEGER(3) unsigned zerofill NOT NULL AUTO_INCREMENT,
    UserName VARCHAR(50) NOT NULL UNIQUE,
    UserPassword VARCHAR(255) NOT NULL,
    UserCreateTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(UserID)
);

CREATE TABLE WaterMeterRecord(
	RecordID INTEGER(7) unsigned zerofill NOT NULL AUTO_INCREMENT,
    RecordTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    RecordUserID  INTEGER(3) unsigned zerofill NOT NULL,
    RecordPropertyID INTEGER(4) unsigned zerofill NOT NULL,
    RecordReading INTEGER(8) unsigned zerofill,
    RecordStatus CHAR(20),
    FOREIGN KEY (RecordUserID) REFERENCES Users(UserID),
    PRIMARY KEY (RecordID)
);

CREATE TABLE WaterUsage(
	UsageID INTEGER(7) unsigned zerofill NOT NULL AUTO_INCREMENT,
    UsagePropertyID INTEGER(4) unsigned zerofill NOT NULL,
    PeriodStart DATETIME,
    PeriodEnd DATETIME,
    UsageData INTEGER,
    PRIMARY KEY (UsageID)
);





INSERT INTO PropertyUnits(UnitBlock,UnitFloor,UnitName) Values ("A","G","1");
INSERT INTO PropertyUnits(UnitBlock,UnitFloor,UnitName) Values ("A","UG","1");
INSERT INTO PropertyUnits(UnitBlock,UnitFloor,UnitName) Values ("B","G","2");
INSERT INTO PropertyUnits(UnitBlock,UnitFloor,UnitName) Values ("B","UG","2");

INSERT INTO Users(UserName,UserPassword) Values ("admin", "admin");
INSERT INTO Users(UserName,UserPassword) Values ("admin2", "admin2");

INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-11-05",002,0001,90,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-11-05",001,0002,80,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-11-05",001,0003,70,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-11-05",001,0004,130,"Pending");


DELIMITER $$

CREATE TRIGGER CalculateUsage
    BEFORE INSERT
    ON WaterMeterRecord FOR EACH ROW
BEGIN
		        
		set @lastmonth = (SELECT RecordTime
					FROM c180_property.watermeterrecord JOIN c180_property.propertyunits
					WHERE watermeterrecord.RecordPropertyID = propertyunits.UnitID 
					AND RecordPropertyID = NEW.RecordPropertyID
					ORDER BY watermeterrecord.RecordTime DESC LIMIT 1);
        set @thismonth = NEW.RecordTime;
        
        IF TIMESTAMPDIFF(MONTH, @lastmonth, @thismonth) >=0 THEN
			SET @LastMonthRecord = (SELECT RecordReading
								FROM c180_property.watermeterrecord JOIN c180_property.propertyunits
								WHERE watermeterrecord.RecordPropertyID = propertyunits.UnitID 
									AND RecordPropertyID = NEW.RecordPropertyID
								ORDER BY watermeterrecord.RecordTime DESC LIMIT 1);
			SET @ThisMonthRecord = NEW.RecordReading;
			INSERT INTO WaterUsage(UsagePropertyID, PeriodStart,PeriodEnd,UsageData) VALUES (NEW.RecordPropertyID, @lastmonth,@thismonth,@ThisMonthRecord - @LastMonthRecord);
        ELSE INSERT INTO WaterUsage(UsagePropertyID, PeriodStart,PeriodEnd,UsageData) VALUES (NEW.RecordPropertyID, @lastmonth,@thismonth,-1);
        END IF;
END$$    
DELIMITER ;




INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-12-05",002,0001,120,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-12-05",001,0002,100,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-12-05",001,0003,130,"Pending");
INSERT INTO WaterMeterRecord(RecordTime, RecordUserID,RecordPropertyID,RecordReading,RecordStatus) Values("2020-12-05",001,0004,145,"Pending");