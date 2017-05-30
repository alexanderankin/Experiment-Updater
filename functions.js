require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
var fs = require('fs');

var asciiA = 65;
function getLetters(number) {
  // number = number - 1;
  var list = [];
  do {
    list.unshift(number % 26 - 1);  // minus one because columns are not 0 indexed
    number = parseInt(number / 26, 10);
  } while (number > 0);

  console.log("list", list);
  return list.map(function (digit) {
    return String.fromCharCode(asciiA + digit)
  }).join('');
}
var result = getLetters(26);
console.log(result);
function appendIndexes(fields, count) {
  count = count || 100;
  fields.length;
}

var dataLocation = '/resources/lomvardas/gspreadsheet/gss-getter/data_recv.json'
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
    callback(null, fields, data);
  });
}

/** */
function makeSchema(fields) {
  var base = {
    id: {type: 'increments', nullable: false, primary: true}
  };

  // for (field in fields) {
  //   console.log(field);
  // }
  fields.map(function (field) {
    field = field.split(' ').join('_');
    field = field.replace(/[&\/\\#,+()$~%.'":*?<>\{\}]/g, '');
    field = field.substring(0, 60);
    // console.log(field);
    base[field] = {
      type: 'string',
      maxlength: 300,
      nullable: true
    };
  });

  return base;
}

// var schema = makeSchema(['a_sample_field with spaces'])
// console.log(schema);

// getGSSInput(function (error, data) {
//   if (error) throw error;
//   var schema = makeSchema(data[0]);
//   console.log(schema);
// });

module.exports = {
  makeSchema: makeSchema,
  getGSSInput: getGSSInput
};
