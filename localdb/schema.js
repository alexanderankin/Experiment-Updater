var knex = require('../bookshelf').getKnexInstance();

/**
 * Construct a schema object from a list of fields
 * 
 * Corresponds to the schema object expected by addTableColumn
 * 
 * @property type: const column types in link:
 * https://github.com/tgriesser/knex/blob/master/src/schema/tablebuilder.js
 */
function makeSchema(fields) {
  var base = {
    _id: {type: 'increments', nullable: false, primary: true}
  };

  fields.map(function (field) {
    base[field] = {
      type: 'text',
      maxlength: 300,
      nullable: true
    };
  });

  return base;
}

/**
 * Take a table name, schema, drop if exists and create new
 * 
 * @param tableName {string}, name of the table to create
 * @param schema {Object},    schema of form like link:
 * 
 * link: https://github.com/TryGhost/Ghost/blob/master/core/server/data/schema
 * /schema.js
 * 
 * Takes inspiration from Ghost via
 * https://blog.ragingflame.co.za/2014/12/16/building-a-simple-api-with-express-and-bookshelfjs
 */
function loadTable(tableName, schema, done) {
  knex.schema.hasTable(tableName).asCallback(function (e, exists) {
    if (e) return done(e);

    // create if not exists
    knex.schema.dropTableIfExists(tableName).asCallback(function (e, response) {
      if (e) return done(e);

      console.log("dropped if exists");

      // create
      knex.schema.createTable(tableName, function (tableObject) {
        var columns = Object.keys(schema);

        columns.forEach(function (column) {
          return addTableColumn(tableName, tableObject, column, schema);
        });
      }).asCallback(function (e, response) {
        if (e) { return done(e); }
        done(null, response);
      });
    })

  });
}

/**
 * Tests for
 * 
 * > function loadTable(tableName, schema, done)
 * 
 * // var schema = {
 * //   id: { type: 'increments', nullable: false, primary: true },
 * //   sequencing_date: { type: 'string', maxlength: 300, nullable: true }
 * // };

 * // loadTable('experiments', schema, function (e, response) {
 * //   if (e) throw e;
 * //   console.log("done");
 * //   console.log(response);
 * // });
*/

/**
 * Runs the fluent interface calls from declarative schema object for column
 * 
 * two pass process:
 * 
 * * text or other field type handled w/ maxlength or varchar argument params
 * * options configured on the field (nullable, primary, etc)
 */
function addTableColumn(tableName, table, columnName, tableSchema) {
  var columnSpec = tableSchema[columnName];
  var column;

  // creation distinguishes between text with fieldtype, string with maxlength and all others
  if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
    column = table[columnSpec.type](columnName, columnSpec.fieldtype);
  } else if (columnSpec.type === 'string') {
    if (columnSpec.hasOwnProperty('maxlength')) {
      column = table[columnSpec.type](columnName, columnSpec.maxlength);
    } else {
      column = table[columnSpec.type](columnName, 191);
    }
  } else {
    column = table[columnSpec.type](columnName);
  }

  if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
    column.nullable();
  } else {
    column.nullable(false);
  }
  if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
    column.primary();
  }
  if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
    column.unique();
  }
  if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
    column.unsigned();
  }
  if (columnSpec.hasOwnProperty('references')) {
    // check if table exists?
    column.references(columnSpec.references);
  }
  if (columnSpec.hasOwnProperty('defaultTo')) {
    column.defaultTo(columnSpec.defaultTo);
  }
}

module.exports = {
  loadTable:  loadTable,
  makeSchema: makeSchema
};
