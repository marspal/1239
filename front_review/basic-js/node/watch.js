// 文件watch
const chokidar = require("chokidar");

// chokidar.watch(".").on('all', (event, path) => {
//   console.log(event, path);
// })

const watcher = chokidar.watch('.', {
  ignored: /(^|[\/\\])\../ || "*.md", // ignore dotfiles
  persistent: true,
  cwd: '.'
});

const log = console.log.bind(console);
watcher
.on('addDir', path => log(`Directory ${path} has been added`))
.on('unlinkDir', path => log(`Directory ${path} has been removed`))
.on('error', error => log(`Watcher error: ${error}`))
.on('ready', () => log('Initial scan complete. Ready for changes'))
.on('raw', (event, path, details) => { // internal
  log('Raw event info:', event, path, details);
});

watcher.on('change', (path, stats) => {
  if (stats) console.log(`File ${path} changed size to ${stats.size}`);
});

function observeProxy(obj) {
  let handler = {
    get(target, key, receiver){
      console.log("获取: "+ key);
      if(typeof target[key] === 'object' && target[key] !== null){
        return new Proxy(target[key], handler);
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver){
      console.log(key+"-数据改变了");
      return Reflect.set(target,key, value, receiver);
    }
  };
  return new Proxy(obj, handler);
}

let obj={
  name:'守候',
  flag:{
      book:{
          name:'js',
          page:325
      },
      interest:['火锅','旅游'],
  }
}
let objTest = observeProxy(obj);