import * as chai from 'chai';
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import Promise from '../src/promise';

chai.use(sinonChai)
const assert = chai.assert;

// mocha模块才有describe和it这两个方法
// 所以需要用mocha来运行该文件
// mocha -r ts-node/register test/index.ts
describe("Promise", () => {
  it('是一个类', () => {
    assert(typeof Promise === 'function')
    assert(typeof Promise.prototype === 'object')
    // 或者
    assert.isFunction(Promise)
    assert.isObject(Promise.prototype)
  })
  it('new Promise()必须接收一个函数，否则就报错', () => {
    assert.throw(() => {
      new Promise(1)
    })
  })
  it('new Promise(fn)会生成一个对象，对象有then方法', () => {
    const promise = new Promise(() => {})
    assert.isFunction(promise.then)
  })
  it('new Promise(fn)中的fn会立即执行', () => {
    // sinon提供一个假的函数
    let fn = sinon.fake()
    const promise = new Promise(fn)
    // 预测fn已经被调用
    assert(fn.called)
  })
  it('new Promise(fn)中的fn执行的时候接收resolve和reject两个函数', (done) => {
    new Promise((resolve, reject) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
      done()
    })
  })
  it('promise.then(onFulfilled)中的onFulfilled会在resolve被调用的时候执行', done => {
    let onFulfilled = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      // onFulfilled还没有被调用
      assert.isFalse(onFulfilled.called)
      resolve()
      // onFulfilled被调用了
      setTimeout(() => {
        assert.isTrue(onFulfilled.called)
        done()
      })
    })
    // @ts-ignore
    promise.then(onFulfilled)
  })
  it('2.2.1', () => {
    const promise = new Promise((resolve) => {
      resolve()
    })
    promise.then(true, null)
  })
})