## ts 高级特性  练习

> 联合类型

目标是批量操作类型,自然少不了类型遍历, 使用in关键字来遍历; 可以使用keyof 动态取出某个键值对类型的key
```ts
  type key = 'vue' | 'react';
  type MappedType = {[k in key]: string} // {vue: string, react: string}

  // 
  interface Student{
    name: string,
    age: number
  }

  type studentKey = keyof Student; // "name" | "age"

  type framework = ['vue', 'react', 'angular'];
  type frameworkVal1 = framework[number];
  type frameworkVal2 = framework[any];
```

> 一组类型批量映射成另一种类型

```ts
  type UnionTypesMap<T> = T extends any? 'placeholder': 'never'; // placeholder任意类型

  // example:
  type UnionTypesMap2Func<T> = T extends any? ()=>T: never;
  type myUnionTypes = "vue" | "react" | "angular";
  type myUnionTypesFuncResult = UnionTypesMap2Func<myUnionTypes>;
  // (() => "vue") | (() => "react") | (() => "angular")
```
> 作用域

全局作用域: 在没有导入的前提下, 在任意位置直接获取并使用它
```ts
 //example: 图片资源
  declare module '*.png';
  declare module '*.svg';
  declare module '*.jpg';

  // 声明类型
  declare type str = string;
  declare interface Foo {
    propA: string;
    propB: number;
  }
 
```

> 使用object类型进行类型声明

```js
  interface ObjectConstructor{
    create(o: object | null): object;
    setPrototypeOf(o: any, proto: object | null): any;
  }
```

```js
interface WeakMap<K extends object, V> {
  delete(key: K): boolean;
  get(key: K): V | undefined;
  has(key: K): boolean;
  set(key: K, value: V): this;
}
```