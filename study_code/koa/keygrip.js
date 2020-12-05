/**
 * @file for signing and verifying data 
 * @description: (such as cookies or URLs) through a rotating credential system,
 */
var compare = require("./tsscmp.js");
var crypto = require('crypto');
module.exports = Keygrip;

function Keygrip(keys, alorithm, encoding) {
    if(!alorithm) alorithm = "sha1";
    if(!encoding) encoding = "base64"
    if(!(this instanceof Keygrip)) return new Keygrip(keys, alorithm, encoding);
    if(!keys || !(0 in keys)){
        throw new Error('Keys must be provided.');
    }
    function sign(data, key){
        return crypto.createHmac(alorithm, key)
            .update(data)
            .digest(encoding)
            .replace(/\/|\+|=/g, function(x){
                return ({"/": "_", "+": "-", "=": ""})[x]
            });
    }
    this.sign = function(data){
        return sign(data, keys[0]);
    }
    this.verify = function(data, digest){
        return this.index(data, digest) > -1;
    }
    this.index = function(data, digest){
        for(var i = 0, l = keys.length; i < l; ++i){
            if(compare(digest, sign(data, keys[i]))){
                return i;
            }
        }
        return -1;
    }
}

Keygrip.sign = Keygrip.verify = Keygrip.index = function(){
    throw new Error("Usage: require('keygrip')(<array-of-keys>)");
}