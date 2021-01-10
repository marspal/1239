import co from '..';
import {readFile as read} from 'mz/fs';
function Pet(name){
  this.name = name;
  this.something = function(){}
}
describe('co(*)', () => {
  it('should aggregate several promises', () => {
    return co(function* (){
      var a = read('package.json', 'utf8');
      var b = read('index.js', 'utf8');
      var res = yield {
        a: a,
        b: b
      };
      expect(Object.keys(res).length).toBe(2);
      expect(~res.a.indexOf('devDependencies')).toBeTruthy();
      expect(~res.b.indexOf('exports')).toBeTruthy();
    });
  });
  it('should noon with args', () => {
    return co(function*(){
      var res = yield {};
      expect(Object.keys(res).length).toBe(0);
    });
  });
})