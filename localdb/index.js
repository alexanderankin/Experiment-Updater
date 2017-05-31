var async = require('async');
var bookshelf = require('../bookshelf').getInstance();

/**
 * 
 */
function saveRows(rows, fields, tableName, done) {
  var Model = getModelClass(tableName);
  async.eachSeries(rows, function saveRow(row, callback) {
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

function getModelClass(name) {
  return bookshelf.Model.extend({ tableName: name });
}

function forgeAttributes(row, fields) {
  var attributes = {};
  for (var idx = 0; idx < row.length; idx++) {
    attributes[fields[idx]] = row[idx] || null;
  }
  return attributes;
}

module.exports = {
  saveRows: saveRows,
  schema:   require('./schema')
};
