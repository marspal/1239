import {readFile as read} from 'mz/fs';

import co from ".."
describe('co(* -> yield [])', function(){
  it('should aggregate several promises', () => {
    return co(function* () {
      var a = read('package.json', 'utf8');
      var b = read('babel.config.js', 'utf8');
      var res = yield [a, b];
      expect(res.length).toBe(2);
      expect(~res[0].indexOf('devDependencies'))
    });
  });
  it('should noop with no args', () => {
    return co(function *() {
      var res = yield [];
      expect(res.length).toBe(0)
    });
  });
  it('should support an array of generators', () => {
    return co(function *() {
      var val = yield [function* () {return 1}]
      expect(val).toEqual([1]);
    });
  });
});