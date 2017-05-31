var fs = require('fs');
var google = require('googleapis');

var authentication = require('./auth');

function getRemoteAuth(callback) {
  authentication.getSecret(function (err, auth) {
    if (err) return callback(err);
    callback(null, auth);
  });
}

function getSpreadsheetData(auth, sheetId, callback) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: sheetId,
    range: 'Sheet1!A1:AF1038',
  }, function(err, response) {
    if (err) return callback(err);

    callback(null, response);
  });
}

/**
 * This function gets data into headers and data, valid column headers, etc.
 * 
 * callback(null, fields, data)
 */
function arrangeData(data, callback) {
  var values = data.values;

  var fields = values.shift().map(function (field) {
    field = field.split(' ').join('_');
    field = field.replace(/[&\/\\#,+()$~%.'":*?<>\{\}]/g, '');
    field = field.substring(0, 60);
    return field;
  });
  fields = appendIndexes(fields, 30);
  callback(null, fields, values);
}

/**
 * This function calculates the default column name of an index.
 * 
 * console.log(getLetters(27));  // 'AB'
 */
var letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
function getLetters(number) {
  return (
    number >= 26
      ? getLetters((number / 26 >> 0) - 1)
      : ''
  ) + letters[number % 26 >> 0];
}

/**
 * This function adds additional columns to the end with no names
 * 
 * This avoids `undefined` columns in MySQL.
 * 
 * console.log(appendIndexes(['ok']))  // ['ok', 'B', 'C', ...]
 */
function appendIndexes(fields, count) {
  count = count || 30;
  for (var i = fields.length; i < count; i++) {
    fields.push(getLetters(i));
  }
  return fields;
}

function authAndGetData(sheetId, callback) {
  getRemoteAuth(function (err, auth) {
    if (err) return callback(err);

    getSpreadsheetData(auth, sheetId, function (err, data) {
      if (err) return callback(err);
      
      arrangeData(data, callback);
    });
  });
}

module.exports = {
  authAndGetData: authAndGetData
};
