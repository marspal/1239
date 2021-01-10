import co from '..';

const ctx = {
  some: 'thing'
}

describe('co.call(this)', () => {
  it('should pass the context', () => {
    return co.call(ctx, function* (){
      expect(this).toBe(ctx);
    });
  });
});