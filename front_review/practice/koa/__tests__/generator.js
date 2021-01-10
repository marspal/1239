import co from '..';

function sleep(ms) {
  return function(done){
    setTimeout(done, ms);
  }
}

function *work() {
  yield sleep(50);
  return 'yay';
}

describe('co(*)', function(){
  describe('with a generator function', function(){
    it('should wrap with co()', function(){
      return co(function *(){
        var a = yield work;
        var b = yield work;
        var c = yield work;

        expect('yay' == a).toBeTruthy();
        expect('yay' == b).toBeTruthy();
        expect('yay' == c).toBeTruthy();

        var res = yield [work, work, work];
        expect(res).toEqual(['yay', 'yay', 'yay']);
      });
    })

    it('should catch errors', function(){
      return co(function *(){
        yield function *(){
          throw new Error('boom');
        };
      }).then(function () {
        throw new Error('wtf')
      }, function (err) {
        expect(err.message === 'boom').toBeTruthy();
      });
    })
  })
})