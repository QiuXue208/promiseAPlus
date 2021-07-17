# 手写 Promise

## 参考文档

1. [PromiseA+英文文档](https://promisesaplus.com/)
2. [PromiseA+中文文档](https://juejin.cn/post/6844903649852784647)

## 测试方案

```
yarn add mocha chai --dev
yarn add @types/mocha @types/chai --dev

yarn global add mocha
mocha -r ts-node/register test/index.ts
```

## Promise 概览

1. Promise 是一个类
2. 构造函数：Promise.prototype.constructor
3. 静态方法（类方法）：Promise.all、Promise.race、Promise.allSettled、Promise.any、Promise.resolve、Promise.reject
4. 原型方法（对象方法）：Promise.prototype.then、Promise.prototype.catch、Promise.prototype.finally
5. 对象状态：state = pending / fulfilled / rejected
