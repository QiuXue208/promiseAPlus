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
  it('2.2.2', (done) => {
    let onFulfilled = sinon.fake()
    const promise = new Promise((resolve) => {
      assert.isFalse(onFulfilled.called)
      resolve(123)
      resolve(12333)
      setTimeout(() => {
        assert(promise.state === 'fulfilled')
        assert.isTrue(onFulfilled.called)
        assert.isTrue(onFulfilled.calledOnce)
        assert(onFulfilled.calledWith(123))
        done()
      })
    })
    promise.then(onFulfilled)
  })
  it('2.2.3', (done) => {
    let onRejected = sinon.fake()
    const promise = new Promise((resolve, reject) => {
      assert.isFalse(onRejected.called)
      reject(123)
      reject(1233)
      setTimeout(() => {
        assert(promise.state === 'rejected')
        assert.isTrue(onRejected.called)
        assert.isTrue(onRejected.calledOnce)
        assert(onRejected.calledWith(123))
        done()
      })
    })
    promise.then(null, onRejected)
  })
  it('2.2.4-在我的代码执行完成前，不得调用then后面的俩函数', (done) => {
    let onFulfilled = sinon.fake()
    const promise = new Promise((resolve) => {
        resolve()
    })
    promise.then(onFulfilled)
    console.log(1)
    assert.isFalse(onFulfilled.called)
    setTimeout(() => {
      assert.isTrue(onFulfilled.called)
      done()
    })
  })
  it('2.2.5', () => {
    const promise = new Promise((resolve) => {
      resolve(1)
    })
    promise.then(function() {
      assert(this === undefined)
    })
  })
  it('2.2.6 then可以被同一个promise调用多次', () => {
    const promise = new Promise((resolve, reject) => {
      reject(1)
    })
    const callbacks = [sinon.fake(), sinon.fake(), sinon.fake()]
    promise.then(null, callbacks[0])
    promise.then(null, callbacks[1])
    promise.then(null, callbacks[2])
    setTimeout(() => {
      assert.isTrue(callbacks[0].called)
      assert.isTrue(callbacks[1].called)
      assert.isTrue(callbacks[2].called)
      assert(callbacks[1].calledAfter(callbacks[0]))
      assert(callbacks[2].calledAfter(callbacks[1]))
    })
  })
  it('2.2.7 then必须返回一个promise', () => {
    const promise = new Promise((resolve) => { resolve() })
    const promise2 = promise.then()
    assert(promise2 instanceof Promise)
  })
  it('2.2.7.1 如果then(onFulfilled, onRejected)中的onFulfilled返回一个值x, 就执行[[Resolve]](promise2, x)', () => {
    const promise = new Promise((resolve) => { resolve() })
    promise.then(() => '成功', () => {}).then((result) => {
      assert(result ==='成功')
    })
  })
  it('2.2.7.1.2 如果then(onFulfilled, onRejected)中的onFulfilled返回一个值x, x是一个promise', (done) => {
    const promise = new Promise((resolve) => { resolve() })
    const fn = sinon.fake()
    promise
      .then(() => '成功', () => {})
      .then((result) => {
        assert(result === '成功')
        return new Promise((resolve) => resolve(123))
      })
      .then(() => {
        return new Promise((resolve, reject) => reject(123))
      }).then(null, fn)
    setTimeout(() => {
      assert(fn.called)
      done()
    })
  })
  it('2.2.7.1.3 如果then(onFulfilled, onRejected)onRejected, x是一个promise, 且失败了', (done) => {
    const promise = new Promise((resolve, reject) => { resolve() })
    const fn = sinon.fake()
    promise
      .then(() => new Promise((resolve, reject) => reject(123)))
      .then(null, fn)
    setTimeout(() => {
      assert(fn.called)
      done()
    })
  })
  it('2.2.7.2', () => {
    const promise = new Promise((resolve, reject) => { resolve() })
    let fn = sinon.fake()
    let error = new Error()
    promise.then(
      () => {
        throw error
      }
    ).then(null, fn)
    // setTimeout(() => {
    //   assert(fn.called)
    //   assert(fn.calledWith(error))
    // })
  })
})