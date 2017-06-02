/* SQB
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

/* Internal module dependencies. */
const SqlObject = require('./sqlobject');
const Serializer = require('../serializer');

/* External module dependencies. */
const assert = require('assert');

/**
 * @class
 * @public
 */

class Statement extends SqlObject {

  //noinspection SpellCheckingInspection
  constructor(builder) {
    super();
    this.builder = builder;
    this.connection = undefined;
  }

  get dbpool() {
    return typeof this.builder.connect === 'function' ?
        this.builder :
        undefined;
  }

  build(config, params) {
    if (config instanceof Serializer) {
      return config.build(this, params);
    } else
      return Serializer.create(config)
          .build(this, params);
  }

  identify(value) {
    this._identity = value;
    return this;
  }

  params(obj) {
    assert.ok(!obj || typeof obj === 'object', 'Ivalid argument');
    this._params = obj;
    return this;
  }

  //noinspection JSUnusedGlobalSymbols
  then(options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = undefined;
    }
    return this.execute(this._params, options).then(callback);
  }

  execute(params, options, callback) {
    if (this.connection)
      return this.connection.execute(this, params, options, callback);
    else {
      const dbpool = this.dbpool;
      assert.ok(dbpool, 'This statement is not executable');
      options = options || {};
      options.autoClose = true;
      return dbpool.connect((conn) => conn.execute(this, params, options, callback));
    }
  }

}

module.exports = Statement;
