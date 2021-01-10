const EventEmitter = require('events');
// console.log(EventEmitter);
const util = require('util');

function MyEmmitter(){
  process.nextTick(()=>{
    this.emit('event');
  });
}

util.inherits(MyEmmitter, EventEmitter);
const myEmitter = new MyEmmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});

