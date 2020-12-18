'use strict';
const util = {
  decode(string) {
    const body = Buffer.from(string, 'base64').toString('utf8');
    return body;
  },
  encode(body){
    body = JSON.stringify(body);
    return Buffer.from(body).toString('base64');
  },
  CookieDateEpoch: new Date("1970-01-01").toUTCString()
};

console.log(util.decode('eyJ2aWV3cyI6NSwidXNlciI6eyJuYW1lIjoiYW5keXh1IiwiYWdlIjoxMjN9LCJfZXhwaXJlIjoxNjA4MzkzNTQ0NjI3LCJfbWF4QWdlIjo4NjQwMDAwMH0='));

module.exports = util;