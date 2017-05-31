require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
var fs = require('fs');
var async = require('async');

var bookshelf = require('./bookshelf').getInstance();
var getGSSInput = require('./input').getGSSInput;
var makeSchema  = require('./functions').makeSchema;

var knex = require('./bookshelf').getKnexInstance();

var loadTable = require('./schema').loadTable;

getGSSInput(function (e, fields, data) {
  var schema = makeSchema(fields); // console.log(schema);
  var tableName = 'experiments';

  loadTable(tableName, schema, function (error, response) {
    if (error) throw error; console.log("ok");

    saveRows(data, fields, tableName, function (error) {
      if (error) throw error;

      console.log("saved rows");
    });
  });
});

function getModelClass(name) {
  return bookshelf.Model.extend({ tableName: name });
}
function saveRows(rows, fields, tableName, done) {
  var Model = getModelClass(tableName);
  async.eachSeries(rows, function (row, callback) {

    // console.log(row, fields);
    // callback(null);
    Model
      .forge(forgeAttributes(row, fields))
      .save()
      .asCallback(function (error, response) {
        // console.log("the error is", error);
        if (error) {
          if (error.code == 'ER_BAD_FIELD_ERROR') {
            console.log(forgeAttributes(row, fields));
            return callback(null);
          }

          return callback(error);
        }

        callback(null);
      });

  }, function (error) {
    if (error) return done(error);
    done(null);
  });
}

function forgeAttributes(row, fields) {
  var attributes = {};
  for (var idx = 0; idx < row.length; idx++) {
    attributes[fields[idx]] = row[idx] || null;
  }
  return attributes;
}

