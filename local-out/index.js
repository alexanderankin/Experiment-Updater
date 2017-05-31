var fs = require('fs');

var getGSSInput = require('./input').getGSSInput;
var db = require('./localdb');

if (require.main === module) {
  getGSSInput(function (e, fields, data) {
    var newSchema = db.schema.makeSchema(fields); // console.log(newSchema);
    var tableName = 'experiments';

    db.schema.loadTable(tableName, newSchema, function (error, response) {
      if (error) throw error; console.log("ok");

      db.saveRows(data, fields, tableName, function (error) {
        if (error) throw error;

        console.log("saved rows");
      });
    });
  });  
}
