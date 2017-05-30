var knex = null;
var bookshelf = null;

function _makeKnexInstance() {
  knex = require('knex')({
    client: 'mysql',
    connection: {
      host     : process.env.dbhost,
      user     : process.env.dbuser,
      password : process.env.dbpass,
      database : process.env.dbname//,
      // charset  : process.env.dbhost
    }
  });
}

function _makeBookshelfInstance() {
  bookshelf = require('bookshelf')(knex);
}

function getInstance() {
  getKnexInstance();

  if (bookshelf === null) _makeBookshelfInstance();

  return bookshelf;
}

function getKnexInstance() {
  if (knex === null) _makeKnexInstance();
  return knex;
}

module.exports = {
  getInstance:     getInstance,
  getKnexInstance: getKnexInstance
};
