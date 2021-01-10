function getIndex(a, b){
  let bIndex = a.indexOf(b[0]);
  if(bIndex === -1){
    return -1;
  }
  for(var i = 1; i<b.length; ++i){
    if(b[i] !== a[bIndex + i]){
      return -1
    }
  }
  return bIndex;
}

console.log(getIndex([1,2],[2,3,4]));