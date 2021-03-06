/* SQB
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

/* Internal module dependencies. */
const SqlObject = require('./sqlobjects/sqlobject');
const SelectStatement = require('./statements/select');
const InsertStatement = require('./statements/insert');
const UpdateStatement = require('./statements/update');
const DeleteStatement = require('./statements/delete');
const Raw = require('./sqlobjects/raw');
const Column = require('./sqlobjects/column');
const Join = require('./sqlobjects/join');
const Condition = require('./sqlobjects/condition');
const ConditionGroup = require('./sqlobjects/conditiongroup');
const Case = require('./sqlobjects/case');
const Serializer = require('./serializer');
const DbPool = require('./connect/pool');
const Connection = require('./connect/connection');
const MetaData = require('./connect/metadata');
const ResultSet = require('./connect/resultset');
const TableMetaData = require('./connect/tablemetadata');
const {ResultCache} = require('./connect/resultcache');

const sqbexport = require('./sqbexport');

//noinspection JSUnusedGlobalSymbols
Object.assign(sqbexport, {

  Serializer,
  DbPool,
  Connection,
  MetaData,
  ResultSet,
  ResultCache,
  TableMetaData,

  SqlObject,
  SelectStatement,
  InsertStatement,
  UpdateStatement,
  DeleteStatement,
  Raw,
  Column,
  Join,
  Condition,
  ConditionGroup,
  Case,

  /**
   * Creates a new serializer
   * @param {Object} config
   * @return {Serializer}
   */
  serializer: function(config) {
    return Serializer.create(config);
  },

  /**
   * Creates a new database pool
   * @param {Object} config
   * @return {DbPool}
   */
  pool: function(config) {
    return DbPool.create(config);
  }

});

module.exports = sqbexport;
