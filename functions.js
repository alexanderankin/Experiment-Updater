require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
var fs = require('fs');

var dataLocation = '/resources/lomvardas/gspreadsheet/gss-getter/data_recv.json'
function getGSSInput(callback) {
  fs.readFile(dataLocation, 'utf-8', function (e, d) {
    if (e) return callback(e);

    var data = JSON.parse(d);
    // console.log(data[0]);
    callback(null, data);
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
