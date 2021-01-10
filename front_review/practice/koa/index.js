/**
 * @file
 * @description 一致性执行*函数
 * @param {Function} gen *函数
 * @param {Array} args 剩余参数
 * @return {Promise} promise 返回一个Promise实例
 */
co.wrap = function (fn) {
    createPromise.__generatorFunction__ = fn;
    return createPromise;
    function createPromise() {
      return co.call(this, fn.apply(this, arguments));
    }
};
  
function co(gen, ...args) {
    const ctx = this;
    return new Promise((resolve, reject) => {
        if (typeof gen === 'function') gen = gen.apply(ctx, args);
        if (!gen || 'function' !== typeof gen.next) resolve(gen);
        onFulfilled();
        function onFulfilled(res) {
            let ret;
            try {
                ret = gen.next(res);
            }
            catch (err) {
               return reject(err);
            }
            next(ret);
            return null;
        }
        function onRejected(err) {
            var ret;
            try {
                ret = gen.throw(err);
            } catch (e) {
                reject(e);
            }
            next(ret);
        }
        function next(ret) {
            if (ret.done) return resolve(ret.value)
            let value = toPromise.call(ctx, ret.value);
            if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
            return onRejected(new TypeError(`You may only yield a function, promise, generator
            , array, or object, but the following object was passed: ${String(ret.value)}`));
        }
    });
}

function toPromise(obj) {
    if (!obj) return obj;
    if (isPromise(obj)) return obj;
    if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
    if ('function' === typeof obj) return thunkToPromise.call(this, obj);
    if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
    if (isObject(obj)) return objectToPromise.call(this, obj);
    return obj;
}
function isPromise(obj) {
    return typeof obj.then === 'function';
}

function isGeneratorFunction(fn) {
    var constructor = fn.constructor;
    if (!constructor) return false;
    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
    return isGenerator(constructor.prototype);
}
function isGenerator(obj) {
    return typeof obj.next === 'function' && typeof obj.throw === 'function';
}
function thunkToPromise(fn) {
    var ctx = this;
    return new Promise((resolve, reject) => {
        fn.call(ctx, function(err, ...res) {
            if(err) return reject(err);
            resolve(res);
        });
    });
}
function arrayToPromise(obj) {
    return Promise.all(obj.map(toPromise, this));
}
function isObject(val) {
    return val.constructor === Object;
}
function objectToPromise(obj) {
    var results = new obj.constructor();
    var keys = Object.keys(obj);
    var promises = [];
    for(var i = 0; i < keys.length; ++i){
        var key = keys[i];
        var promise = toPromise.call(this, obj[key]);
        if (promise && isPromise(promise)) defer(promise, key);
        else results[key] = obj[key];
    }
    return Promise.all(promises).then(function(){
        return results;
    });
    function defer(promise, key) {
        results[key] = undefined;
        promises.push(promise.then(function (res) {
            results[key] = res;
        }));
    }
}

module.exports = co.default = co.co = co;
