/* SQB
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb/
 */

/* Internal module dependencies. */

const SqlObject = require('./sqlobject');

/**
 * @class
 * @public
 */

class Raw extends SqlObject {

  constructor(str) {
    super();
    this.type = 'raw';
    this.text = str;
  }

  get isRaw() {
    return this.type === 'raw';
  }

}

module.exports = Raw;
