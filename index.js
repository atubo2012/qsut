/**
 * Doc is created by JsDoc
 * https://jsdoc.app
 */

// Part 1. Logger


//Prepare configuration of logger handle
let logConfig = {
    appenders: {
        out: {type: 'stdout'},
        app: {type: 'file', filename: process.env.LOG_FILE||'/logs/zg.log', maxLogSize: 2048000, backups: 3, compress: true},
    },
    categories: {
        default: {appenders: ['out', 'app'], level: process.env.LOG_LEVEL_APP||'debug'},
        utils: {appenders: ['out', 'app'], level: process.env.LOG_LEVEL_QSUT||'trace'}
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


/**
 * Part 2. ID
 */


/**
 * Generate a customized ID with 3 parts : prefix(optional),random,postfix
 * @param idPrefix {String}
 *      '' as default,usually named according business module
 * @param rslength {int}
 *      length of random part which is composed of digits and letters
 * @param jinzhi {int}
 *      [10,36] used to convert current time  to a SHORT string . Maximum is 36.
 * @returns {string} a random ID
 */
exports.getId = function (idPrefix, rslength,jinzhi) {
    return getId(idPrefix, rslength,jinzhi)
};
let getId = function (idPrefix, rslength, jinzhi) {
    //console.log(postFix);
    let ts = parseInt((new Date().getTime()).toFixed(0));

    let postFix = rslength ? randomString(rslength) : '';

    if(jinzhi||10){
        ts = ts.toString(jinzhi).toUpperCase();
    }
    return  (idPrefix || '') + ts + postFix;
};

/**
 * Generate a customized ID with 3 parts : prefix(optional),random,postfix
 * @param idPrefix  '' as default,usually named according business module
 * @param rslength length of random part which is composed of digits and letters
 * @returns {string} a random ID
 */
exports.getId32 = function (idPrefix, rslength) {
    return getId(idPrefix, rslength,32)
};


/**
 * Get a random string with specific length
 * @param len {int} 32 as default
 * @returns {string} a random string
 */
exports.randomString = function (len) {
    return randomString(len);
};
let randomString = function (len) {
    len = len || 32;    //这个默认复制的方式很帅
    let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    let maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd.toUpperCase();
};





/**
 * Part 3. Date
 */

/**
 * Format date
 * @param date {Date} eg: new Date()
 * @param style {String} eg: 'yyyyMMdd'|'hhmmss'
 * @returns {string} eg: '20210309' | '123001'
 */
exports.formatDate = function(date, style) {
    return fmd(date,style);
};

/**
 * Get before or after days’ Date
 * @param days
 */
exports.getThatDate = function(days){
    let today = new Date();
    return today.setDate(today.getDate()+days);
};

/**
 * Get yyyyMMdd format date
 * @returns {string} eg: '20210309'
 */
exports.getToday = function() {
    return fmd(new Date(),'yyyyMMdd');
};

/**
 * Get new expiry date
 * @param oldExpiredDate {Date} original expiry date
 * @param addedDays {int} Days postponed
 * @returns {Date} new expiry date
 */
let getNewExpiredDate = function (oldExpiredDate,addedDays){
    let today = new Date();
    let old_expired_date_ms = oldExpiredDate.getTime();

    //如原到期日晚于当前，则基于原到期日延长addedDays日，返回新的到期日
    //如原到期日早于当前，则基于当前日期延长
    let new_expired_date = (
        old_expired_date_ms >= today.getTime() ?
            oldExpiredDate.setDate(new Date(old_expired_date_ms).getDate()+addedDays) :
            today.setDate(today.getDate()+addedDays)
    );
    return new Date(new_expired_date);//.toLocaleDateString();
};
exports.getNewExpiredDate = function (oldExpiredDate,addedDays) {
    return getNewExpiredDate(oldExpiredDate,addedDays);
};


/**
 * Get hhmmss format time
 * @returns {string} eg: '123001'
 */
exports.getNow = function() {
    return fmd(new Date(),'hhmmss');
};

function fmd(date, style) {
    let y = date.getFullYear();
    let M = "0" + (date.getMonth() + 1);
    M = M.substring(M.length - 2);
    let d = "0" + date.getDate();
    d = d.substring(d.length - 2);
    let h = "0" + date.getHours();
    h = h.substring(h.length - 2);
    let m = "0" + date.getMinutes();
    m = m.substring(m.length - 2);
    let s = "0" + date.getSeconds();
    s = s.substring(s.length - 2);
    return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('hh', h).replace('mm', m).replace('ss', s);
}

/**
 * 当前时刻与指定时刻的差。
 * @param timer hhmm格式，表示小时分钟
 * @returns {number} 毫秒， >=0表示已过期，<0表示尚未过期
 */
exports.getTimeDiffrence = function(timer){
    return getTimeDiffrence(timer);
};
function getTimeDiffrence(timer) {

    //设置then的时间对象
    let then = new Date();
    then.setHours(parseInt(timer.substring(0,2)));
    then.setMinutes(parseInt(timer.substring(2,4)));
    then.setSeconds(0);

    //计算当前时间与then的时差
    return (new Date() - then);
}


/**
 * 功能：判断参数中的时间点是否晚于当前时间点
 * @param then
 * @returns {boolean}
 */
exports.isLateThanNow=function(then){
    let thenDate = new Date(then);
    let now = new Date();

    l.trace('thenDate:'+thenDate,'nowDate:'+now);
    return thenDate.getTime()-now.getTime()>0
};

/**
 * 功能：获得比当前时间点晚若干小时的时间对象
 * @param hours 小时数
 * @param hasSecond time 中是否包含秒
 * @returns {{date: string, time: string}}
 */
exports.getLater=function(hours,hasSecond){
    let then= new Date(new Date().getTime()+hours*60*60*1000);
    let thenTime = fmd(then,'hh:mm:ss');

    let ret = {date:fmd(then,'yyyy-MM-dd'),time:hasSecond ? thenTime:thenTime.substring(0,thenTime.lastIndexOf(':'))};

    l.trace('那时',then,'结果',ret);
    return ret ;
};

/**
 * Checking if specific time has passed.
 * @param timer {String} 'hhmm'
 * @returns {boolean}
 */
exports.isTimeOut = function(timer){
    return getTimeDiffrence(timer)>0 ;
};



// Part 4. Convertion between string and objects


/**
 * Convert elements' values in a object into a array
 * @param obj {object}
 * @returns {Array}
 */
exports.obj2Array = function(obj){
    return obj2Array(obj);
};
function obj2Array (obj) {
    let arr = [];
    for (let itm in obj) {
        arr.push(obj[ itm ]);
    }
    return arr;
}



/**
 * 按照数组keys的顺序将对象中的值转换成素组
 * Convert values of obj into an array and be in order of array keys'
 * @param obj
 * @param keys
 * @returns {Array}
 */
exports.obj2ArrayByOrder=function(obj,keys){
    return obj2ArrayByOrder(obj,keys);
};
function obj2ArrayByOrder (obj,keys) {
    let arr = [];
    keys.forEach(function (item) {
        arr.push(obj[item])
    }) ;
    return arr;
}


/**
 * 将对象数组转化为元素为数组的数组
 * Save all values in an object array into an new array
 * @param objArray
 * @returns {Array}
 */
exports.objArray2Array =function (objArray) {
    let ret = [];
    objArray.forEach(function (item) {
        ret.push(obj2Array(item));
    });
    return ret;
};

/**
 * Check if str is JSON format
 * 参考：https://blog.csdn.net/qq_26400953/article/details/77411520
 * @param str {string}
 * @returns {boolean}
 *
 */
exports.isJsonString=function(str) {
    try {
        l.trace(str);
        const type = typeof(JSON.parse(str));
        if ( type === "object") {
            return true;
        }
    } catch(e) {
        l.error(e.toString());
    }
    return false ;
};

/**
 * Check if str is a Number
 * @param str {String | Number}
 * @returns {boolean}
 */
exports.isNumber = function (str) {
    let a = parseFloat(str);
    return !isNaN(a);
};


/**
 * Part 5. File
 */

/**
 * Read from a file
 * @param filename with path
 * @returns {Buffer | String}
 */
exports.rf = function (filename) {
    return require('fs').readFileSync(filename,'utf8');
};
/**
 * Write to a file
 * @param filename
 * @param content  {String}
 */
exports.wf = function (filename,content) {
    let fs = require('fs');
    fs.writeFileSync(filename, content, 'utf8', function(err) {
        if (err) {
            console.error('写入文件时发生错误',err);
        }
    });
};

/**
 * Append content to a file
 * @param filename with path
 * @param content {String}
 */
exports.af = function(filename,content){
    let fs = require('fs');
    fs.appendFileSync(filename,content,'utf-8',(err)=>{
        if(err) throw err;
        console.log('写入文件时发生错误',err);
    });
};


/**
 * Generate a .xlsx file from a array including multiple rows
 * @param dataArray {Array} eg:[[1,3],['aa','bb'],[3,'dd']]
 * @param path {String} file path ended with /
 * @param fileName {String} not need to include .xlsx in filename
 * @param sheetName {String} sheet1 as default if not set.
 */
exports.exp2xls = function(dataArray,path,fileName,sheetName) {
    let xlsx = require('node-xlsx');
    let fs = require('fs');

    l.info('Generating EXCEL ......');
    let file = xlsx.build([{
        name: sheetName || 'sheet1',
        data: dataArray
    }]);

    fs.writeFileSync(path+fileName+'.xlsx', file, 'binary'); // 写入
    l.info('Finish to Generate EXCEL.');
};


/**
 * Part 6. Enrypt and Decrypt
 */


//加密函数参考：https://nodejs.org/dist/latest-v6.x/docs/api/crypto.html#crypto_class_cipher
const crypto = require('crypto');

/**
 * Checking if specified algorithm is available
 * @param alg ['aes192','aes-128-ecb','aes-256-cbc']
 * You can check available algorithm in OS with following  command
 * ···
 * openssl list-cipher-algorithms
 * ···
 * reference：https://blog.csdn.net/LVXIANGAN/article/details/42195429
 */
function isValidAlg(alg) {
    const algs = ['aes192','aes-128-ecb','aes-256-cbc'];
    const err = alg+'is not available algorithm ，only support'+algs;
    if(algs.indexOf(alg)<0) throw err;
}

/**
 * Encrypt data
 * @param data Data being encrypted
 * @param key Password used to encrypt data
 * @param aesType Support ['aes192','aes-128-ecb','aes-256-cbc']
 * @param codeType hex/base64
 * @returns {String} Encrypted Data
 */
exports.aesEncrypt= function(data,key,aesType,codeType){
    return aesEncrypt(data,key,aesType,codeType);
};
function aesEncrypt(data,key,aesType,codeType){
    isValidAlg(aesType);
    const cipher = crypto.createCipher(aesType,key);
    let crypted = cipher.update(data,'utf8',codeType);
    return crypted+cipher.final(codeType);
}


/**
 * Decrypt Data
 * @param encryptedData Dncrypted Data
 * @param key Password used to encrypt data
 * @param aesType Support ['aes192','aes-128-ecb','aes-256-cbc']
 * @param codeType hex/base64
 * @returns {String} Decrypted Data
 */
exports.aesDecrypt= function(encryptedData,key,aesType,codeType){
    return aesDecrypt(encryptedData,key,aesType,codeType);
};
function aesDecrypt(encryptedData,key,aesType,codeType){
    isValidAlg(aesType);
    const decipher = crypto.createDecipher(aesType,key);
    let decrypted = decipher.update(encryptedData,codeType,'utf8');
    return decrypted+decipher.final('utf8');
}


/**
 * Generate a Hash
 * @param data
 * @param hashType md5/hmac
 * @param algType md5/sha1/sha256/sha512
 * @param codeType hex/base64
 * @param key hmac use the key
 * @returns {Buffer | string | * }
 */
function getHash(data,hashType,algType,codeType,key){
    let ret = null;
    if (/md5/.test(hashType)) {
        ret = crypto.createHash(algType).update(data).digest(codeType);
    }
    else if (/hmac/.test(hashType)) {
        ret = crypto.createHmac(algType,key).update(data).digest(codeType);
    }

    return ret;
}
exports.getHash= function(data,hashType,algType,codeType,key){
    return getHash(data,hashType,algType,codeType,key);
};


/**
 * Part 7. Http and Network
 */

exports.httpRequest = function (httpType, options, sendData, cb,encode) {
    return httpRequest(httpType, options, sendData, cb,encode);
};
/**
 * Sending http/https request with sendData by GET/POST method.
 * Not support binary file such as image,becase default encode is set to utf-8.
 * If need to download image , choose downloadImage()
 * API: https://nodejs.org/api/http.html#http_http_request_url_options_callback
 *      https://nodejs.org/api/http.html#http_http_request_options_callback
 * @param httpType {string} http|https
 * @param options  {object} host and path(with querystring) are required , default method is GET}
 * @param sendData Data sent to host
 * @param cb callback function
 * @param encode default is utf-8
 *
 * Other optional http modules,like 'got', may be intruduced in future.
 * https://nodesource.com/blog/express-going-into-maintenance-mode
 */
let httpRequest = function (httpType, options, sendData, cb,encode) {
    let http = require(httpType);
    let iconv = require("iconv-lite");
    const req1 = http.request(options, (res) => {
        let size = 0;

        l.trace(`STATUS: ${res.statusCode}`);
        l.trace(`HEADERS: ${JSON.stringify(res.headers)}`);

        let ret = [];
        res.on('data', (chunk) => {
            ret.push(chunk);
            size += chunk.length;
            l.trace(`BODY: ${chunk}`);
        });
        res.on('end', () => {
            let buff = Buffer.concat(ret, size);
            let result = iconv.decode(buff, encode ? encode : 'utf8');
            l.trace('result:', result);
            cb(result);
        });
    });
    req1.on('error', (e) => {
        l.error(`httpRequest:problem with request: ${e}`);
    });
    req1.on('uncaughtException', (e) => {
        l.error(`httpRequest: uncaughtException: ${e}`);
    });
    req1.end(sendData);
};


/**
 * httpsxReq is a GET case of httpRequest.
 * Based http.get(),it's a simple version of httpRequest.
 * @param httpType
 * @param url
 * @param cb
 */
let  httpxReq = function(httpType,url,cb){
    let httpx = require(httpType);
    let iconv = require("iconv-lite");

    let _url=httpType+'://'+url;
    httpx.get(_url, function (res) {

        let datas = [];
        let size = 0;

        res.on('data', function (data) {

            datas.push(data);
            size += data.length;

        });
        res.on("end", function () {
            let buff = Buffer.concat(datas, size);
            let result = iconv.decode(buff, "utf8");
            cb(result);

        });
    }).on("error", function (err) {
        console.error(err,'httpx请求失败');
    });
};
exports.httpxReq = function (httpType,url,cb) {
    return httpxReq(httpType,url,cb);
};


exports.downloadImage = function (url,fileName,cb) {
    return downloadImage(url,fileName,cb);
};
async function downloadImage(url,fileName,cb){


    const httpType = url.substring(0,url.indexOf('://'));
    const urlTail = url.substring(url.indexOf('://')+3);

    let httpx = require(httpType);
    const req1 = httpx.request(httpType+'://'+urlTail
        , (res) => {
            let size = 0;
            let ret = [];
            res.on('data', (chunk) => {
                ret.push(chunk);
                size += chunk.length;
                //console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                let buff = Buffer.concat(ret, size);
                const origionalFileName = url.substring(url.lastIndexOf('/')+1);
                const fileType = origionalFileName.substring(origionalFileName.lastIndexOf('.'));
                //console.log(origionalFileName,fileType);

                //Default file name is timestamp+originalFileName
                const fn = fileName ? fileName+fileType :  new Date().getTime()+'-'+origionalFileName
                let fs = require('fs');
                fs.writeFileSync(fn,buff,'binary',(err)=>{
                    err ? console.log('Error occured when writing a image to local, please check it.'):''

                    //If a callback function is set it'll be called
                    cb? cb(fn):''

                    // The other approach is to emit a event which
                    // includes an object as a parameter of event handler method/listener
                });

            });
        });
    req1.on('error', (e) => {
        console.error(`downloadImage:problem with request: ${e}`);
    });
    req1.on('uncaughtException', (e) => {
        console.error(`downloadImage: uncaughtException: ${e}`);
    });
    req1.end('');
}

/**
 * Send event to a ws server
 * reference: https://socket.io/docs/client-api/#socket-emit-eventname-args-ack
 * @param url server's url
 * @param message content would be sent
 */
let socketSend = function (url, message) {
    let socket = require('socket.io-client')(url);
    l.trace('send message');
    socket.emit('event', message);

};
exports.socketSend = function (url, message) {
    return socketSend(url, message);
};
//socketSend('http://localhost:3000','this is from utils');


/**
 * 功能：触发一个事件，由监听器对事件进行处理
 * 场景：
 * 1、业务流程中的埋点，关键场景，如上单、开工、完工等。在db.close()方法后、res.send()前调用。
 * 2、系统异常时的埋点。在catch中调用
 * 算法：
 * 1、应用、系统相关的状态、活动在埋点处发出事件，由事件处理函数对外进行通知
 * 2、www启动时，安装时间生成器emt，emt在utils中被引用，进而可被各个业务模块使用
 * @param argsObject {object} 形如{data:p,type:'N_UIFUPD'}的参数
 */
exports.notify = function (argsObject) {
    global.emt.emit('notify', argsObject);
};



/**
 * Part A. Scene
 */

/**
 * Nomalizate a file name
 * @param maybeAsFileName 与文件名相关的内容
 * @returns {string}
 */
exports.normalizeFileName = function(maybeAsFileName){
    //暂不替换中文标点符号:.，。？
    let ret = maybeAsFileName.replace(/[":&#$*|><,?\/\+\\\[\]]/g,'');
    if(ret.length>=250)
        ret = ret.substring(0,250);
    //参考：https://www.cnblogs.com/moqing/archive/2016/07/13/5665126.html
    //http://www.jb51.net/article/110516.htm
    //http://www.jb51.net/article/84784.htm
    //http://www.jb51.net/article/80544.htm
    return ret;
};

/**
 * Get weather
 * @param cb
 * @param city
 */
exports.getWeather = function(cb,city){
    const cityUrlEncoded = require('querystring').encode({
        "city":city,
        "key":'bec43a3613373cc952d132e2677b136b'
    });
    let ret = '';
    httpRequest('http',
        {
            host:'apis.juhe.cn',
            path:'/simpleWeather/query?'+cityUrlEncoded
        },
        ''
        ,(result) => {

            //应答的包括今日与将来的天气信息
            let weather = JSON.parse(result);

            //今日天气
            let todayWeather = weather.result.future[0];
            //明日天气
            let nextDayWeather = weather.result.future[1];

            let nextDayWeatherDesc =
                '天气'+nextDayWeather.weather+
                '，气温'+nextDayWeather.temperature;

            //计算两日的温差
            let ndt = nextDayWeather.temperature.replace(/℃/g, '').split('/');
            let tdt = todayWeather.temperature.replace(/℃/g, '').split('/');
            let tdiff = [ndt[0] - tdt[0], ndt[1] - tdt[1]];

            ret = '明日'+nextDayWeatherDesc+'。\n与今天比，高温' + getDescription(tdiff[0])+' 低温' + getDescription(tdiff[1]);
            cb(ret);
        },);
};
function getDescription(temperatureDiff){
    let ret = '';
    if(temperatureDiff>0)  ret = '【热'+temperatureDiff+'度】';
    if(temperatureDiff<0)  ret = '【凉'+(0-temperatureDiff)+'度】';
    if(temperatureDiff===0) ret = '【相同】';
    return ret;
}

/**
 * Generate connection string for mongodb
 * @param url {string} eg: mongodb://%s:%s@www.abcdefnet.com:27117/test?authMechanism=%s
 * @param user {string}
 * @param passwd {string}
 * @param auth {string}
 * @returns {string} connection string. eg:http://ssdfsdfd
 * Reference:https://docs.mongodb.com/manual/reference/connection-string/
 */
exports.getDburl = function (url,user,passwd,auth) {
    let vuser = encodeURIComponent(user);
    let vpassword = encodeURIComponent(passwd);

    //https://nodejs.org/api/util.html#util_util_format_format_args
    return require('util').format(url, vuser, vpassword, auth);
};

/**
 * Checking cellphone's number if valid
 * @param str
 * @returns {boolean}
 */
let isPoneAvailable = function (str) {
    let myreg = /^1[3456789]\d{9}$/; //latest@2020 https://blog.csdn.net/z591102/article/details/104989395
    return myreg.test(str);
    //let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    //Another rule：/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
};
exports.isPoneAvailable = function (str) {
    return isPoneAvailable(str);
};


/**
 * The third part's API
 */

/**
 * Send a sms
 * Reference:https://console.cloud.tencent.com/sms/smsContent/1400055205/0/10
 * @param tpltId        短信模板ID，//短信模板的“ID”字段值，
 * @param phoneNumbers  接收短信的号码（文本数组），如：["17001826978", "18516257890"]
 * @param params        短信内容占位符（文本数组），如：["验证码002033", "有效期"]，params的元素个数，应与模板中的占位符数量相同，不能多也不能少。
 * @param cf  Object including appkey and appid。
 */
let sendSms = function (tpltId, phoneNumbers, params,cf) {
    let QcloudSms = require("qcloudsms_js");
    let appid = cf.SI_APPID_QQSMS;
    let appkey = cf.SI_APPKEY_QQSMS;

    let qcloudsms = QcloudSms(appid, appkey);

    //用来演示的回调函数
    function callback(err, res, resData) {
        if (err)
            l.error("短信发送错误: ", err);
        else
            l.trace("短信发送应答: ", resData);
    }

    //多条发送的demo
    let msender = qcloudsms.SmsMultiSender();   //多条发送的对象
    msender.sendWithParam("86", phoneNumbers, tpltId, params, "", "", "", callback);
};
exports.sendSms = function (tpltId, phoneNumbers, params ,cf) {
    return sendSms(tpltId, phoneNumbers, params,cf);
};
//sendSms(88752,['17001826978'],['1234','60']);


/**
 * 功能：将对象转换成“查询字符串”，查询参数按照字母表排序
 * 场景：对拟支付订单的信息进行签名。
 * @param args         订单数据
 * @returns {string}   查询字符串
 */
exports.obj2queryString = function (args) {
    return obj2queryString(args);
};
let obj2queryString = function (args) {
    let keys = Object.keys(args);
    keys = keys.sort();
    let newArgs = {};
    keys.forEach(function (key) {
        newArgs[key.toLowerCase()] = args[key];
    });

    let str = '';
    for (let k in newArgs) {
        str += '&' + k + '=' + newArgs[k];
    }
    str = str.substr(1);

    l.trace('obj2queryString():', str);
    return str;
};

/**
 * 功能：将对象转换成“查询字符串”，查询参数按照字母表排序
 * 场景：微信支付时，将对象转换成querystring，并对签名。
 * @param payApplyInfo
 * @param cf {SI_MCHT_KEY:'xxxxx'}  微信支付的商户号
 * @returns {*}
 */
exports.paysignjsapi2 = function paysignjsapi2(payApplyInfo,cf) {

    let str = obj2queryString(payApplyInfo);
    str = str + '&key=' + cf.SI_MCHT_KEY;
    l.trace('paysign2 string', str);

    let md5Str = require('crypto').createHash('md5').update(str).digest('hex');
    l.trace('paysign2 md5Str', md5Str);

    md5Str = md5Str.toUpperCase();
    l.trace('paysign2 up md5Str', md5Str);

    return md5Str;
};

/**
 * 功能：将Array型的value转换成String型的value
 * 场景：微信支付应答报文解析
 * @param wxpayArray
 * @returns {{}}
 */
exports.wxpayArray2Object = function wxpayArray2Object(wxpayArray) {

    let ret = {};
    let keys = Object.keys(wxpayArray);
    keys = keys.sort();
    keys.forEach(function (key) {
        ret[key.toLowerCase()] = wxpayArray[key][0];
    });
    return ret;
};

/**
 * 功能：将形如$0,$1的占位符，替换成话术
 * 场景：向用户发送通知类信息时
 * @param jsonData JSON格式的数据
 * @param fields 话术中包含的数据字段(数组)，按照先后顺序
 * @param words  话术模板
 * @returns {*}
 */
exports.getSpeakSpec = function (jsonData, fields, words) {
    let ret = words;
    for (let i = 0; i < fields.length; i++) {
        let a = '$' + i;
        let item = fields[i];

        //若列名中有星号，则对内容中的数字进行脱敏处理。
        if (item.indexOf('*') >= 0) {
            item = item.replace('*', '');
            ret = ret.replace(a, jsonData[item].replace(/[\d]/g, '*'));
        } else {
            ret = ret.replace(a, jsonData[item]);
        }
    }
    return ret;
};
