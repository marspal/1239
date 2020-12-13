/*来订阅一下，当 count 改变的时候，我要实时输出新的值*/
subscribe(() => {
  console.log(state.count);
});

/*我们来修改下 state，当然我们不能直接去改 state 了，我们要通过 changeCount 来修改*/
changeCount(2);
changeCount(3);
changeCount(4);