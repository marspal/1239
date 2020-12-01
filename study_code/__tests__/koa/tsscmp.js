import timeSafeCompare from '../../koa/tsscmp';

process.on('error', function (e) {
	console.log('caught: ' + e);
});

function testEqual(a, b) {
    return timeSafeCompare(a, b) && a === b;
}

function testNotEqual(a, b) {
    return !testEqual(a, b);
}

function random(length){
    length = length || 32;
    var result = '';
    var possible =  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-+/*[]{}-=\|;\':\"<>?,./";
    for( var i=0; i < length; i++ ){
        result += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return result;
}

function run(count){
    count = count || 100 * 1000;
    console.log('benchmark count: ' + count/1000 + 'k');
    console.time('benchmark');
    while(count--){
        timeSafeCompare(random(), random());
    }
    console.timeEnd('benchmark');
}

describe('timeSafeCompare: preventing timing attacks', () => {
    describe('unit', () => {
        it('positive tests', () => {
            expect(testEqual(
                '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935',
                '127e6fbfe24a750e72930c220a8e138275656b8e5d8f48a98c3c92df2caba935',
                'test '
            )).toBeTruthy()
            expect(testEqual('a', 'a')).toBeTruthy();
            expect(testEqual('', '')).toBeTruthy();
            expect(testEqual(undefined, undefined)).toBeTruthy();
            expect(testEqual(true, true)).toBeTruthy();
            expect(testEqual(false, false)).toBeTruthy();
            var a = {a: 12};
            expect(testEqual(a, a)).toBeTruthy();
            function f1() {}
            expect(testEqual(f1, f1)).toBeTruthy();
        });
        it('negative tests', () => {
            expect(testNotEqual('')).toBeTruthy();
            expect(testNotEqual('a', 'b')).toBeTruthy();
            expect(testNotEqual('a', 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa')).toBeTruthy();
            expect(testNotEqual('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', 'a')).toBeTruthy();
            expect(testNotEqual('alpha', 'beta')).toBeTruthy();
            expect(testNotEqual(false, true)).toBeTruthy();
            expect(testNotEqual(false, undefined)).toBeTruthy();
            expect(testNotEqual(function () { }, function () { })).toBeTruthy();
            expect(testNotEqual({}, {})).toBeTruthy();
            expect(testNotEqual({ a: 1 }, { a: 1 })).toBeTruthy();
            expect(testNotEqual({ a: 1 }, { a: 2 })).toBeTruthy();
            expect(testNotEqual([1, 2], [1, 2])).toBeTruthy();
            expect(testNotEqual([1, 2], [1, 2, 3])).toBeTruthy();
            var a = { p: 1 };
            var b = { p: 1 };
            function f1() { return 1; };
            function f2() { return 1; };
            expect(testNotEqual(a, b)).toBeTruthy();
            expect(testNotEqual(f1, f2)).toBeTruthy();


        });
    });
    describe('benchmark 压力测试', () => {
        run(100000);
    });
});

