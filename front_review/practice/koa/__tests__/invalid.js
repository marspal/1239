import co from '..';

describe('yield <invalid>', () => {
  it('should throw an error', () => {
    return co(function* (){
      try {
        yield null;
        throw new Error('lol');
      }catch(err) {
        expect(err instanceof TypeError).toBeTruthy();
        expect(~err.message.indexOf('You may only yield'));
      }
    });
  });
})