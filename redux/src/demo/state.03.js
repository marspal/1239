subscribe(() => { // 订阅
  console.log(state.count);
});

// 修改
changeCount(2);
changeCount(3);
changeCount(4);