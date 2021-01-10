import co from '..';

describe('co(gen, args)', () => {
  it('should pass the rest of the arguments', () => {
    return co(function* (num, str, arr, obj, fn){
      expect(num).toBe(42);
      expect(str).toBe('forty-two');
      expect(arr[0]).toBe(42);
      expect(obj.value).toBe(42);
      expect(fn instanceof Function).toBeTruthy();
    }, 42, 'forty-two', [42], {value: 42}, function(){});
  })
});