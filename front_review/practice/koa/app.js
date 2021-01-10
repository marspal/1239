/**
 * @file: 简单的node服务
 */
const http = require('http');
const url = require('url');
const stack = [];
const parseUrl = (req) => {
    return url.parse(req.url);
}
const app = function (req, res) {
    let index = 0;
    function next(err) {
        let layer = stack[index++];
        if (!layer) {
            console.log(12112);
            return;
        }
        let path = parseUrl(req).pathname;
        let route = layer.route;
        if (path.toLowerCase().substr(0, route.length) !== route.toLowerCase()) {
            return next(err);
        }
        call(layer, err, req, res, next);
    }
    next();
};
function call(layer, err, req, res, next) {
    let handle = layer.handle;
    let arity = handle.length;
    let error = err;
    let hasError = Boolean(err);
    try {
        if(hasError && arity === 4){
            handle(err, req, res, next);
        } else if(!hasError && arity < 4) {
            handle(req, res, next);
        }
        return;
    } catch (e) {
        error(e);
    }
    next(error);
}
app.use = function (route, fn) {
    if (typeof route === 'function') {
        fn = route;
        route = "/";
    }
    
    if (route[route.length - 1] === '/') {
        route = route.slice(0, -1);
    }

    stack.push({
        route,
        handle: fn
    });
};

app.listen = function(){
    let server = http.createServer(this);
    return server.listen.apply(server, arguments);
}
module.exports = app;