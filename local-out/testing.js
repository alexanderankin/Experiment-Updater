require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
var fs = require('fs');

var bookshelf = require('./bookshelf');
var getGSSInput = require('./functions').getGSSInput;
var makeSchema  = require('./functions').makeSchema;

getGSSInput(function (error, data) {
  if (error) throw error;
  var schema = makeSchema(data[0]);
  console.log(schema);
});
