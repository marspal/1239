/**
 * @file 
 * @author andyxu
 */

const {
    normalize  
} = require('path');

module.exports = send;


async function send(ctx, path, opts = {}) {
    path = decode(path);
    if (path === -1) throw ctx.throw(400, 'failed to decode');
}

function decode(path) {
    try {
        return decodeURIComponent(path);
    }
    catch (err) {
        return -1;
    }
}
