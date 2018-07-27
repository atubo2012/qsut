exports.printMsg = function () {
    console.log("This is a message from the demo package");
};

exports.getDburl = function (url) {
    f = require('util').format;
    assert = require('assert');

    let user = encodeURIComponent('myTester');
    let password = encodeURIComponent('xyz123');
    let authMechanism = 'DEFAULT';
// Connection URL = 'mongodb://%s:%s@www.qstarnet.com:27117/test?authMechanism=%s'
    url = f(url, user, password, authMechanism);

    console.log("This is a message from the demo package");
    return url;
};


let logConfig = {
    appenders: {
        out: {type: 'stdout'},
        app: {type: 'file', filename: '/root/.pm2/logs/zg.log', maxLogSize: 2048000, backups: 3, compress: true},
    },
    categories: {
        default: {appenders: ['out', 'app'], level: 'debug'},
        utils: {appenders: ['out', 'app'], level: 'debug'}
    }
};
let log4js = require('log4js');
log4js.configure(logConfig);
let logger = function (name) {
    return log4js.getLogger(name);
};
exports.logger = function (name) {
    return logger(name);
};
let l = logger('utils');
//l.info('this is utils');