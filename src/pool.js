/* SQB-connect
 ------------------------
 (c) 2017-present Panates
 SQB may be freely distributed under the MIT license.
 For details and documentation:
 https://panates.github.io/sqb-connect/
 */

/* Internal module dependencies. */
const SqlBuilder = require('./sqlbuilder');


/**
 * @class
 * @public
 */

class DbPool extends SqlBuilder{

    constructor(config) {
        super();
        config = typeof config === 'object' ? config : {dialect: config};
        const pool = config.pool = config.pool || {};
        pool.max = pool.max || 10;
        pool.min = pool.min || 0;
        pool.increment = pool.increment || 1;
        pool.timeout = pool.timeout || 60;
        Object.defineProperty(this, 'config', {value: Object.freeze(config), writable: false, configurable: false});
    }

    //noinspection JSUnusedGlobalSymbols
    get dialect() {
        return this.config.dialect;
    }

    //noinspection JSUnusedGlobalSymbols
    get user() {
        return this.config.user;
    }

    //noinspection JSUnusedGlobalSymbols
    get schema() {
        return this.config.schema;
    }

    //noinspection JSUnusedGlobalSymbols
    connect(callback) {

        const self = this;
        let promise = new Promise((resolve, reject) => {
            self._getConnection((error, connection) => {
                if (error)
                    reject(error);
                else
                    resolve(connection);
            })
        });

        if (callback) {

            promise = promise.then(connection => {

                function done(commit) {
                    if (commit) {
                        connection.commit(err => {
                            if (err)
                                done(false);
                            else
                                connection.release();
                        });
                    } else {
                        connection.rollback(err => {
                            if (err)
                                process.emitWarning(err);
                            connection.release();
                        });
                    }
                }

                try {
                    callback(connection, done);
                } catch (e) {
                    done(false);
                    throw e;
                }
            });
        }

        return promise;
    }

    /* Abstract members */

    //noinspection JSMethodCanBeStatic,JSUnusedLocalSymbols
    /**
     *
     * @param callback
     * @private
     */
    _getConnection(callback) {
        throw new Error('Abstract error');
    }

}

DbPool.register = function (dialect, poolProto) {
    const items = this._registry = this._registry || {};
    items[dialect] = poolProto;
};

DbPool.get = function (dialect) {
    return this._registry ? this._registry[dialect] : undefined;
};

DbPool.create = function (config) {
    if (config instanceof DbPool)
        return config;

    config = typeof config === 'string' ? {dialect: config} : typeof config === 'object' ? config : {};


    if (!config.dialect || config.dialect === 'generic')
        return new DbPool(config);
    if (process.env.NODE_ENV === 'test' && config.dialect === 'test')
        return new DbPool();

    const clazz = this.get(config.dialect);
    if (clazz)
        return new clazz(config);
    else throw new Error(`Driver "${config.dialect}" is not registered`);
};

module.exports = DbPool;