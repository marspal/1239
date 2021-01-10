function Mvvm(options = {}){
  // 将所有属性挂载 vm
  this.$options = options;
  let data = this._data = this.$options.data;
  // 数据劫持: 给对象Object.defineProperty vue 不会给没有的属性新增get set
  observe(data);
  // 数据代理
  for(let key in data){
    Object.defineProperty(this, key, {
      get(){
        
      }
    });
  }
}

function observe(data){
  if(!data || typeof data !== 'object') return;
  Observe(data);
}

function Observe(data){
  for(let key in data){
    let val = data[key];
    observe(val);
    Object.defineProperty(data, key, {
      get(){
        return val;
      },
      set(newValue){
        if(val === newValue){
          return;
        }
        val = newValue;
        observe(val);
      }
    });
  }
}

const vm = new Mvvm({
  data: {
    a: 1,
    b: 2,
    c: {
      d: 1, 
      e: 2,
      f: {g: 12, h: 123}
    }
  }
});



