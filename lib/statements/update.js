/* SQB
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

/* Internal module dependencies. */

const Statement = require('./statement');
const Table = require('../sqlobjects/tablename');
const ConditionGroup = require('../sqlobjects/conditiongroup');

/**
 * @class
 * @public
 */

class UpdateStatement extends Statement {

  constructor(dbpool, table, values) {
    super(dbpool);
    this.type = 'update';
    this._values = {};
    this._table = table.isRaw ? table : new Table(String(table));
    this.set(values);
    this.clearWhere();
  }

  /**
   *
   * @return {UpdateStatement}
   * @public
   */
  clearWhere() {
    this._where = new ConditionGroup();
    return this;
  }

  /**
   *
   * @param {Object|Raw} values
   * @return {UpdateStatement}
   * @public
   */
  set(values) {
    if (!values) return this;
    if (values.isRaw)
      this._values = values;
    else if (typeof values === 'object') {
      // We build a new map of upper keys for case insensitivity
      const out = {};
      Object.getOwnPropertyNames(values).forEach(
          function(key) {
            out[key.toUpperCase()] = values[key];
          }
      );
      this._values = out;
    } else throw new TypeError('Invalid argument');
    return this;
  }

  /**
   *
   * @param {...Condition} conditions
   * @return {UpdateStatement}
   * @public
   */
  where(...conditions) {
    if (!conditions.length) return this;
    this._where.add(...conditions);
    return this;
  }

}

module.exports = UpdateStatement;
