import Keygrip from '../../koa/keygrip';


describe('Keygrip', () => {
  describe('constructor', function(){
    it('should constructor new instance', function(){
      var keys = Keygrip(['SEKRIT1']);
      expect(keys instanceof Keygrip).toBeTruthy();
    })
    it('should work without new Keyword', function(){
      var keys = Keygrip(['SEKRIT2']);
      expect(keys instanceof Keygrip).toBeTruthy();
    });
  });
  describe('"Keys" argument', function(){
    it('should throw an Error when undefined', () => {
      expect(()=>{
        Keygrip();
      }).toThrow();

      expect(()=>{
        Keygrip()
      }).toThrowError('Keys must be provided.');

      expect(() =>{
        Keygrip()
      }).toThrowError(Error);
    })
    it('when empty array should throw an Error', () => {
      expect(() => {
        Keygrip([]);
      }).toThrow();
      expect(() => {
        Keygrip([]);
      }).toThrowError('Keys must be provided.');
    });
  });
  describe('should construct object when array of strings', () => {
    var keys = new Keygrip(['SKerIT1']);
    expect(keys instanceof Keygrip).toBeTruthy();
  })
  describe(".index(Data)", () => {
    it("should return key index that signed data", () => {
      var keys = new Keygrip(['SEKRIT2', 'SEKRIT1']);
      var data = 'Keyboard Cat has a hat.';
      expect(keys.index(data, '_jl9qXYgk5AgBiKFOPYK073FMEQ')).toEqual(0);
      expect(keys.index(data, '34Sr3OIsheUYWKL5_w--zJsdSNk')).toEqual(1);
    });
    it("should return -1 when no key matches", () => {
      var keys = new Keygrip(['SEKRIT2', 'SEKRIT1'])
      var data = 'Keyboard Cat has a hat.'

      expect(keys.index(data, 'xmM8HQl2eBtPP9nmZ7BK_wpqoxQ')).toEqual(-1);
    });
  })
  describe('with "algorithm"', () => {
    it('should return key index using algorithm', () => {
      var keys = new Keygrip(['SEKRIT1'], 'sha256');
      var data = "Keyboard Cat has a hat.";
      expect(keys.index(data, 'pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk')).toBe(0);
    });
  })
  describe('width "encoding"', () => {
    var keys = new Keygrip(['SEKRIT1'], null, 'hex');
    var data = 'Keyboard Cat has a hat.';
    expect(keys.index(data, 'df84abdce22c85e51858a2f9ff0fbecc9b1d48d9')).toEqual(0)
  });
  describe('.sign(data)', () => {
    it('should sign a string', () => {
      var keys = new Keygrip(['SEKRIT1'])
      var hash = keys.sign('Keyboard Cat has a hat.')
      expect(hash).toEqual('34Sr3OIsheUYWKL5_w--zJsdSNk');
    });
    it('should sign with first secret', () => {
      var keys = new Keygrip(['SEKRIT1'], 'sha256')
      var hash = keys.sign('Keyboard Cat has a hat.')
      expect(hash).toEqual('pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk');
    });
    it("should return signature in encoding", () => {
      var keys = new Keygrip(['SEKRIT1'], null, 'hex');
      var hash = keys.sign('Keyboard Cat has a hat.');
      expect(hash).toEqual('df84abdce22c85e51858a2f9ff0fbecc9b1d48d9')
    });

  });
  describe('.verify(data)', () => {
    it('should validate against any key', () => {
      var keys = new Keygrip(['SEKRIT2', 'SEKRIT1'])
      var data = 'Keyboard Cat has a hat.'
      expect(keys.verify(data, '_jl9qXYgk5AgBiKFOPYK073FMEQ')).toBeTruthy();
      expect(keys.verify(data, '34Sr3OIsheUYWKL5_w--zJsdSNk')).toBeTruthy();
    });
    it('should fail with bogus data', () => {
      var keys = new Keygrip(['SEKRIT2', 'SEKRIT1'])
      var data = 'Keyboard Cat has a hat.'
      expect(keys.verify(data, 'bogus data')).toBeFalsy()
    });
    it('should fail when key not present', () => {
      var keys = new Keygrip(['SEKRIT2', 'SEKRIT1'])
      var data = 'Keyboard Cat has a hat.'
      expect(keys.verify(data, 'xmM8HQl2eBtPP9nmZ7BK_wpqoxQ')).toBeFalsy();
    });
    it('should validate using algorithm', function () {
      var keys = new Keygrip(['SEKRIT1'], 'sha256')
      var data = 'Keyboard Cat has a hat.'
      expect(keys.verify(data, 'pu97aPRZRLKi3-eANtIlTG_CwSc39mAcIZ1c6FxsGCk')).toBeTruthy()
    })
    it('should validate using encoding', function () {
      var keys = new Keygrip(['SEKRIT1'], null, 'hex')
      var data = 'Keyboard Cat has a hat.'
      expect(keys.verify(data, 'df84abdce22c85e51858a2f9ff0fbecc9b1d48d9')).toBeTruthy();
    })
  })
});