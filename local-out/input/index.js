var fs = require('fs');

var dataLocation = '/resources/lomvardas/gspreadsheet/gss-getter/data_recv.json'

/**
 * This function handles all the stuff
 * 
 * gets the json, separates out the fields...
 */
function getGSSInput(callback) {
  fs.readFile(dataLocation, 'utf-8', function (e, d) {
    if (e) return callback(e);

    var data = JSON.parse(d);
    var fields = data.shift().map(function (field) {
      field = field.split(' ').join('_');
      field = field.replace(/[&\/\\#,+()$~%.'":*?<>\{\}]/g, '');
      field = field.substring(0, 60);
      return field;
    });
    fields = appendIndexes(fields, 30);
    callback(null, fields, data);
  });
}

var letters = 'abcdefghijklmnopqrstuvwxyz'.toUpperCase();
function getLetters(number) {
  return (
    number >= 26
      ? getLetters((number / 26 >> 0) - 1)
      : ''
  ) + letters[number % 26 >> 0];
}
// console.log(getLetters(27));

function appendIndexes(fields, count) {
  count = count || 30;
  for (var i = fields.length; i < count; i++) {
    fields.push(getLetters(i));
  }
  return fields;
}
// console.log(appendIndexes(['ok']));

module.exports = {
  getGSSInput: getGSSInput
};
