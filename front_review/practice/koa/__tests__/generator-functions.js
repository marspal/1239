import co from '..';

function sleep(ms){
  return function(done){
    setTimeout(done, ms)
  }
}
function* work(){
  yield sleep(50);
  return 'yay';
}

describe('co(fn*)', () =>{
  it('should wrap with co()', () => {
    return co(function *(){
      var a = yield work;
      var b = yield work;
      var c = yield work;
      expect(a).toBe('yay');
      expect(b).toBe('yay');
      expect(c).toBe('yay');
      const res = yield [work, work, work];
      expect(res).toEqual(['yay', 'yay', 'yay']);
    });
  });
  it('should catch errors', () => {
    return co(function* (){
      yield function* () {
        throw new Error('boom');
      }
    }).then(() => {
      throw new Error('wtf');
    }, (err)=>{
      expect(err.message).toBeTruthy();
    });
  });
});