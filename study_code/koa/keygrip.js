/**
 * @file
 */
var crypto = require('crypto');
const hash = crypto.createHmac('sha1', '123a11sd');

// 可任意多次调用update():
hash.update('Hello, world!');
hash.update('Hello, nodejs! asdasd');

console.log(hash.digest('base64'));
module.exports = Keygrip;

function Keygrip(keys, alorithm, encoding) {
    if(!alorithm) alorithm = "sha1";
    if(!encoding) encoding = "base64"
    if(!(this instanceof Keygrip)) return new Keygrip(keys, alorithm, encoding);
    if(!keys || !(0 in keys)){
        throw new Error('Keys must be provided.');
    }
}
