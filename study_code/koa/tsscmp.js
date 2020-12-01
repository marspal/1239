/**
 * @file 解决timing attacks
 * 思路: createHmac 生成等长的hash值
 */
var crypto = require('crypto');
module.exports = timeSafeCompare;

function timeSafeCompare(a, b) {
    var sa = String(a);
    var sb = String(b);
    var key = crypto.pseudoRandomBytes(32);
    // Buffer 类型
    var ah = crypto.createHmac('sha256', key).update(sa).digest();
    var bh = crypto.createHmac('sha256', key).update(sb).digest();
    return bufferEqual(ah, bh) && a === b;
}

function bufferEqual(a, b) {
    if (a.length !== b.length) return false;
    if (crypto.timingSafeEqual) return crypto.timingSafeEqual(a, b);
    for (var i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}
