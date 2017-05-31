require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
var fs = require('fs');

var getGSSInput = require('./input').getGSSInput;

/** */
function makeSchema(fields) {
  var base = {
    _id: {type: 'increments', nullable: false, primary: true}
  };

  // for (field in fields) {
  //   console.log(field);
  // }
  fields.map(function (field) {
    // field = field.split(' ').join('_');
    // field = field.replace(/[&\/\\#,+()$~%.'":*?<>\{\}]/g, '');
    // field = field.substring(0, 60);
    // // console.log(field);
    base[field] = {
      // type: 'string',
      type: 'text',
      // maxlength: 300,
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
