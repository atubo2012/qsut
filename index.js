exports.printMsg = function () {
    console.log("This is a message from the demo package");
};

exports.getDburl = function (url) {
    f = require('util').format;
    assert = require('assert');

    let user = encodeURIComponent('myTester');
    let password = encodeURIComponent('xyz123');
    let authMechanism = 'DEFAULT';
    url = f(url, user, password, authMechanism);

    console.log("This is a message from the demo package");
    return url;
};

/**
 * 生成ID
 * @param idPrefix，id前缀，默认无前缀，
 * @param rslength，随机生成后缀的长度
 * @param jinzhi，表示进制的数字，如32,16,8
 * @returns {string}
 */
let getId = function (idPrefix, rslength, jinzhi) {
    //console.log(postFix);
    let ts = parseInt((new Date().getTime()).toFixed(0));

    let postFix = rslength ? randomString(rslength) : '';

    if(jinzhi||10){
        ts = ts.toString(jinzhi).toUpperCase();
    }
    return  (idPrefix || '') + ts + postFix;

};

exports.getId32 = function (idPrefix, rslength) {
    return getId(idPrefix, rslength,32)
};
exports.getId = function (idPrefix, rslength,jinzhi) {
    return getId(idPrefix, rslength,jinzhi)
};

//logger handle
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
//l.info('this is utils');



/**
 * 将日期格式化
 */
exports.formatDate = function(date, style) {
    return fmd(date,style);
};

/**
 * 取得今天的日期
 */
exports.getToday = function() {
    return fmd(new Date(),'yyyyMMdd');
};

/**
 * 取得现在的时间
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
 * 导出形如excel文件
 * @param dataArray 数组类型的数据
 * @param path 以/结尾的路径名
 * @param filename 文件名
 */
exports.exp2xls = function(dataArray,path,filename) {

    let xlsx = require('node-xlsx');
    let fs = require('fs');

    log('开始生成EXCEL');
    let file = xlsx.build([{
        name: 'sheet1',
        data: dataArray
    }]);   //构建xlsx对象

    fs.writeFileSync(path+filename+'.xlsx', file, 'binary'); // 写入
    log('完成生成EXCEL');
};

/**
 * 将对象的value转换成数组
 * 如果要将key转换成数组，就push(item)
 */
function obj2Array (obj) {
    let arr = [];
    for (let itm in obj) {
        arr.push(obj[itm]);
    }
    return arr;
}
exports.obj2Array = function(obj){
    return obj2Array(obj);
};


/**
 * 按照数组keys的顺序将对象中的值转换成素组
 * @param obj
 * @param keys
 * @returns {Array}
 */
function obj2ArrayByOrder (obj,keys) {
    let arr = [];
    //遍历keys，并将
    keys.forEach(function (item) {
        arr.push(obj[item])
    }) ;
    return arr;
}
exports.obj2ArrayByOrder=function(obj,keys){
    return obj2ArrayByOrder(obj,keys);
};
obj2ArrayByOrder({'a':'a1','b':'b1'},['b','a']);


/**
 * 将对象数组转化为元素为数组的数组
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
 * 检查一个字符串是否为数字
 * @param str
 * @returns {boolean}
 */
exports.isNumber = function (str) {
    let a = parseFloat(str);

    // if(isNaN(a)){
    //     //log(str +' is not number '+a);
    //     return false;
    // }else{
    //     //log(str +' is  number '+a);
    //     return true;
    // }

    return !isNaN(a);
};

/**
 * 读取指定文件的内容
 * @param filename
 * @returns {Buffer | string}
 */
exports.rf = function (filename) {
    return require('fs').readFileSync(filename,'utf8');
};
/**
 * 向文件中写入指定的内容
 * @param filename
 * @param content
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
 * 向指定文件中以追加模式写入内容
 * @param filename
 * @param content
 */
exports.af = function(filename,content){
    let fs = require('fs');
    fs.appendFileSync(filename,content,'utf-8',(err)=>{
        if(err) throw err;
        console.log('写入文件时发生错误',err);
    });
};

/**
 * 当前时刻与指定时刻的差。
 * @param timer hhmm格式，表示小时分钟
 * @returns {number} 毫秒， >=0表示已过期，<0表示尚未过期
 */
function getTimeDiffrence(timer) {

    //设置then的时间对象
    let then = new Date();
    then.setHours(parseInt(timer.substring(0,2)));
    then.setMinutes(parseInt(timer.substring(2,4)));
    then.setSeconds(0);

    //计算当前时间与then的时差
    return (new Date() - then);
}
exports.getTimeDiffrence = function(timer){
    return getTimeDiffrence(timer);
};

//加密函数参考：https://nodejs.org/dist/latest-v6.x/docs/api/crypto.html#crypto_class_cipher
const crypto = require('crypto');

/**
 * 检查是否为有效的算法。
 * @param alg
 */
function isValidAlg(alg) {
    //可通过命令查看OS支持的算法：openssl list-cipher-algorithms
    const algs = ['aes192','aes-128-ecb','aes-256-cbc'];

    const err = alg+'不是可选的算法，应为'+algs+'内的算法之一';
    if(algs.indexOf(alg)<0) throw err;
}

/**
 * 对称加解密函数
 * @param data
 * @param key
 * @param aesType
 * @param codeType
 * @returns {*}
 */
function aesEncrypt(data,key,aesType,codeType){
    isValidAlg(aesType);
    const cipher = crypto.createCipher(aesType,key);
    let crypted = cipher.update(data,'utf8',codeType);
    return crypted+cipher.final(codeType);
}
exports.aesEncrypt= function(data,key,aesType,codeType){
    return aesEncrypt(data,key,aesType,codeType);
};

function aesDecrypt(encryptedData,key,aesType,codeType){
    isValidAlg(aesType);
    const decipher = crypto.createDecipher(aesType,key);
    let decrypted = decipher.update(encryptedData,codeType,'utf8');
    return decrypted+decipher.final('utf8');
}
exports.aesDecrypt= function(encryptedData,key,aesType,codeType){
    return aesDecrypt(encryptedData,key,aesType,codeType);
};

/**
 *
 * @param data 原文
 * @param hashType md5/hmac
 * @param algType md5/sha1/sha256/sha512
 * @param codeType hex/base64
 * @param key hmac使用的key
 * @returns {Buffer | string | * | any}
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
 * 功能：对文件名进行规范化
 * 场景：根据聊天内容写入文件
 * @param fileName 与文件名相关的内容
 * @returns {string}
 */
exports.normalizeFileName = function(fileName){
    //暂不替换中文标点符号:.，。？
    let ret = fileName.replace(/[":&#$*|><,?\/\+\\\[\]]/g,'');
    if(ret.length>=250)
        ret = ret.substring(0,250);
    //参考：https://www.cnblogs.com/moqing/archive/2016/07/13/5665126.html
    //http://www.jb51.net/article/110516.htm
    //http://www.jb51.net/article/84784.htm
    //http://www.jb51.net/article/80544.htm
    //console.log('原文件名',fileName);
    //console.log('新文件名',ret);
    return ret;

};

exports.getWeather = function(cb){
    let ret = '';
    httpxReq('http', 'v.juhe.cn/weather/index?cityname=%E4%B8%8A%E6%B5%B7&dtype=&format=&key=ffd9caaa66c61ad531bb259f135cbcc4', (result) => {

        //应答的包括今日与将来的天气信息
        let weather = JSON.parse(result);

        //今日天气
        let todayWeather = weather.result.today;

        //明日日期
        let now = new Date();
        let nextDay = now.setTime(fmd(new Date(now.getTime() + 24 * 60 * 60 * 1000), 'yyyyMMdd'));

        //明日天气
        let nextDayWeather = weather.result.future['day_' + nextDay];
        let nextDayWeatherDesc =
            '天气'+nextDayWeather.weather+
            '，气温'+nextDayWeather.temperature+
            '，风力'+nextDayWeather.wind;

        //计算两日的温差
        let ndt = nextDayWeather.temperature.replace(/℃/g, '').split('~');
        let tdt = todayWeather.temperature.replace(/℃/g, '').split('~');
        let tdiff = [ndt[0] - tdt[0], ndt[1] - tdt[1]];


        console.log(tdiff);

        ret = '明日'+nextDayWeatherDesc+'。与今天相比，高温' + getDescription(tdiff[0])+' 低温' + getDescription(tdiff[1]);
        cb(ret);
    });
};

function getDescription(temperatureDiff){
    let ret = '';
    if(temperatureDiff>0)  ret = '【热'+temperatureDiff+'度】';
    if(temperatureDiff<0)  ret = '【凉'+temperatureDiff+'度】';
    if(temperatureDiff===0) ret = '气温相同';
    return ret;
}

/**
 * Sending http/https request with sendData by GET/POST method
 *
 * @param httpType http/https
 * @param options  {host,path,method,port}
 * @param sendData Data sent to host
 * @param cb callback function
 * @param encode default is utf-8
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
exports.httpRequest = function (httpType, options, sendData, cb,encode) {
    return httpRequest(httpType, options, sendData, cb,encode);
};
// httpRequest('https',{host:'www.baidu.com' ,path:'/','port':'443',method:'GET'},'',(result)=>{
//     l.info('httpRequesttest',result);
// });


/**
 * Checking cellphone number if valid
 * @param str
 * @returns {boolean}
 */
let isPoneAvailable = function (str) {
    let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;   //Another rule：/^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
    return myreg.test(str)
};
exports.isPoneAvailable = function (str) {
    return isPoneAvailable(str);
};
//l.info('Is the cellphone number valid?',isPoneAvailable('13362224037'));



/**
 * 短信发送函数。
 * @param tpltId        短信模板ID，//短信模板的“ID”字段值，参考https://console.cloud.tencent.com/sms/smsContent/1400055205/0/10
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
exports.randomString = function (len) {
    return randomString(len);
};
//console.log(randomString(4));

/**
 * 功能：向指定的ws服务器发送event事件。
 * 技术参考：https://socket.io/docs/client-api/#socket-emit-eventname-args-ack
 * @param url
 * @param message 消息内容
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
 *@param argsObject ：形如{data:p,type:'N_UIFUPD'}的参数
 */
exports.notify = function (argsObject) {
    global.emt.emit('notify', argsObject);
};


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

    l.trace('对象->String:', str);
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
 * 检查字符串是否为Json格式
 * @param str 被检查的字符串
 * @returns {boolean}
 * 参考：https://blog.csdn.net/qq_26400953/article/details/77411520
 */
exports.isJsonString=function(str) {
    try {
        if (typeof(JSON.parse(str)) === "object") {
            return true;
        }
    } catch(e) {
    }
    return false ;
};

/**
 * 根据给定的截止日期获得新的截止日期
 * @param oldExpiredDate 原截止日期
 * @param addedDays 延期天数
 * @returns {string} 截止日期
 */
let getNewExpiredDate = function (oldExpiredDate,addedDays){
    let today = new Date();
    let old_expired_date_ms = oldExpiredDate.getTime();
    let new_expired_date = (
        old_expired_date_ms >= today.getTime() ?
            new Date(old_expired_date_ms).setDate(new Date(old_expired_date_ms).getDate()+addedDays) :
            today.setDate(today.getDate()+addedDays)
    );
    return new Date(new_expired_date);//.toLocaleDateString();
};
exports.getNewExpiredDate = function (oldExpiredDate,addedDays) {
    return getNewExpiredDate(oldExpiredDate,addedDays);
};
console.log(getNewExpiredDate(new Date('2019-08-12'),30));
