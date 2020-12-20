'use strict';
const util = {
  decode(string) {
    const body = Buffer.from(string, 'base64').toString('utf8');
    const json = JSON.parse(body);
    return json;
  },
  encode(body){
    body = JSON.stringify(body);
    return Buffer.from(body).toString('base64');
  },
  CookieDateEpoch: new Date("1970-01-01").toUTCString(),
  hash(sess){
    // crc 循环冗余检查; 接收方进行检验确定数据
    return "";
  }
};


module.exports = util;