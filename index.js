require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});

var fs = require('fs');
var path = require('path');

if (!fs.existsSync(path.join(__dirname, 'client_secret.json'))) {
  throw new Error("Missing client_secret.json, see README.md.");
}

var authAndGetData = require('./remote-in').authAndGetData;
var db = require('./local-out/localdb');

// spreadsheet id
// table name
authAndGetData('1Lxm1AaWR--icvBcKlvjeDPdkNwskJFqEbSwxavsTd0U', function (e, fields, data) {
  if (e) console.log(e);

  var newSchema = db.schema.makeSchema(fields); // console.log(newSchema);
  var tableName = 'experiments';

  db.schema.loadTable(tableName, newSchema, function (error, response) {
    if (error) throw error; //console.log("ok");

    db.saveRows(data, fields, tableName, function (error) {
      if (error) throw error;

      console.log("Updated Data Successfully!");
      process.exit();
    });
  });
});
