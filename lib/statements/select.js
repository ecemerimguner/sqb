/* SQB
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

/* Internal module dependencies. */
const Statement = require('./statement');
const SqlObject = require('../sqlobjects/sqlobject');
const TableName = require('../sqlobjects/tablename');
const Column = require('../sqlobjects/column');
const Join = require('../sqlobjects/join');
const ConditionGroup = require('../sqlobjects/conditiongroup');
const Order = require('../sqlobjects/order');

/* External module dependencies. */
const assert = require('assert');

/**
 * @class
 * @public
 */

class SelectStatement extends Statement {

  constructor(dbpool, ...columns) {
    super(dbpool);
    this.type = 'select';
    this.clearColumns();
    this.clearJoin();
    this.clearWhere();
    if (columns.length)
      this.columns(...columns);
  }

  get isSelect() {
    return this.type === 'select';
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearColumns() {
    this._columns = [];
    return this;
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearFrom() {
    this._tables = [];
    return this;
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearJoin() {
    this._joins = [];
    return this;
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearGroupBy() {
    this._groupby = [];
    return this;
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearOrderBy() {
    this._orderby = [];
    return this;
  }

  /**
   *
   * @return {SelectStatement}
   * @public
   */
  clearWhere() {
    this._where = new ConditionGroup();
    return this;
  }

  /**
   *
   * @param {...string|Raw} column
   * @return {SelectStatement}
   */
  columns(...column) {
    const self = this;
    for (const arg of column) {
      if (Array.isArray(arg)) {
        for (const item of arg) {
          self.columns(item);
        }
      } else if (arg)
        this._columns.push(arg instanceof SqlObject ? arg : new Column(arg));
    }
    return this;
  }

  /**
   *
   * @param {...string|Raw} table
   * @return {SelectStatement}
   */
  from(...table) {
    this.clearFrom();
    for (const arg of table) {
      if (arg)
        this._tables.push(
            arg.isSelect || arg.isRaw ? arg : new TableName(String(arg)));
    }
    return this;
  }

  /**
   *
   * @param {...Join} join
   * @return {SelectStatement}
   */
  join(...join) {
    for (const arg of join) {
      if (arg instanceof Join)
        this._joins.push(arg);
      else if (arg)
        throw new TypeError(
            'Invalid argument in method "join"');
    }
    return this;
  }

  /**
   *
   * @param {*} conditions...
   * @return {SelectStatement}
   * @public
   */
  where(...conditions) {
    this._where.add(...conditions);
    return this;
  }

  /**
   *
   * @param {...Raw|String} field
   * @return {SelectStatement}
   * @public
   */
  groupBy(...field) {
    this.clearGroupBy();
    for (const arg of field) {
      if (arg)
        this._groupby.push(arg.isRaw ? arg : new Column(String(arg)));
    }
    return this;
  }

  /**
   *
   * @param {...Raw|String} field
   * @return {SelectStatement}
   * @public
   */
  orderBy(...field) {
    this.clearOrderBy();
    for (const arg of field) {
      if (arg)
        this._orderby.push(arg.isRaw ? arg : new Order(String(arg)));
    }
    return this;
  }

  /**
   *
   * @param {string} alias
   * @return {SelectStatement}
   * @public
   */
  as(alias) {
    this._alias = alias;
    return this;
  }

  /**
   *
   * @param {int} limit
   * @return {SelectStatement}
   * @public
   */
  limit(limit) {
    this._limit = limit;
    return this;
  }

  /**
   *
   * @param {int} offset
   * @return {SelectStatement}
   * @public
   */
  offset(offset) {
    this._offset = offset;
    return this;
  }

  /**
   *
   * @param {Function} callback
   * @return {SelectStatement}
   */
  onFetchRow(callback) {
    if (!callback) return this;
    assert(typeof callback === 'function');
    this._onfetchrow = this._onfetchrow = [];
    this._onfetchrow.push(callback);
    return this;
  }

}

module.exports = SelectStatement;
