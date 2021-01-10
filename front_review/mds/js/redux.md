# Redux 设计理念到源码分分析

> 组成

reducer、store、dispatch、middleware

> redux单项数据流

store(dispatch(middleware), Reducer, state) -> View -> action(creator)->store

[单项数据流](./images/redux单项数据流.jpg)

