/**
 * @file
 */
var crypto = require('crypto');

module.exports = Keygrip;

function Keygrip(keys, alorithm, encoding) {
    if(!alorithm) alorithm = "sha1";
    if(!encoding) encoding = "base64"
    if(!(this instanceof Keygrip)) return new Keygrip(keys, alorithm, encoding);
    if(!keys || !(0 in keys)){
        throw new Error('Keys must be provided.');
    }
}