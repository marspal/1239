import delegate from '../../koa/delegetes';
describe('.method(name)', () => {
    it('should delegets methods', () => {
        const obj = {};
        obj.request = {
            foo(val) {
                expect(this).toBe(obj.request);
                return val;
            }
        };
        var delObj = delegate(obj, 'request');
        delObj.method('foo');
        expect(obj.foo('something')).toBe('something');
    });
});


describe('.getter(name)', function () {
    it('should delegate getters', () => {
        const obj = {};
        obj.request = {
            get type() {
                return 'text/html';
            }
        };
        delegate(obj, 'request').getter('type');
        expect(obj.type).toBe('text/html');
    });
});

describe('.setter(name)', function () {
    it('should delegate setters', () => {
        const obj = {};
        obj.request = {
            get type() {
                return this._type.toUpperCase();
            },
            set type(val) {
                return this._type = val;
            }
        };
        delegate(obj, 'request').setter('type');
        obj['type'] = 'aaa';
        expect(obj.request.type).toBe('AAA');
    });
});

describe('.access(name)', () => {
    it('should delegete setters and getter', () => {
        const obj = {
            request: {
                get type() {
                    return this._type && this._type.toUpperCase() || '';
                },
                set type(val) {
                    return this._type = val;
                }
            }
        };

        delegate(obj, 'request').access('type');
        obj.type = 'aaa';
        expect(obj.type).toBe('AAA');
    });
});

// 把属性搞成一个函数
describe('.fluents(name)', () => {
    it('should delegate in a fluent fashion', () => {
        const obj = {
            settings: {
                env: 'development'
            }
        };
        delegate(obj, 'settings').fluent('env');
        expect(obj.env()).toBe('development');
        expect(obj.env('production').env()).toBe('production');
        expect(obj.env('production')).toBe(obj);
    });
});

describe('.auto(proto, targetProto,target)', () => {
    it('should apply properties', function(){
        var obj = {
            settings: {
              env: 'development'
            }
        };
        var setAs = 0;
        Object.defineProperty(obj.settings, 'getter', {
            get() {
                return this.env;
            }
        });
        Object.defineProperty(obj.settings, 'setter', {
            set: val => setAs = val
        });
        delegate.auto(obj, obj.settings, 'settings');
        expect(obj.env).toBe('development');
        expect(obj.getter).toBe('development');
        obj.setter = 10;
        expect(setAs).toBe(10);
        // obj.constant = 10;
        // expect(obj.constant).toBe(2);
    });
});