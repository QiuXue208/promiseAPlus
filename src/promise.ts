import { type } from "os"

class Promise2 {
  // 存放 onFulfilled和onRejected
  callbacks = []
  state = 'pending'
  resolve(result) {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    setTimeout(() => {
      this.callbacks.length && this.callbacks.forEach(([onFulfilled]) => {
        onFulfilled.call(undefined, result)
      })
    }, 0)
  }
  reject(reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    setTimeout(() => {
      this.callbacks.length && this.callbacks.forEach(([onFulfilled, onRejected]) => {
        onRejected.call(undefined, reason)
      })
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise()必须接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(onFulfilled?, onRejected?) {
    const handler = []
    if (typeof onFulfilled === 'function') {
      handler[0] = onFulfilled
    }
    if (typeof onRejected === 'function') {
      handler[1] = onRejected
    }
    if (handler.length) {
      this.callbacks.push(handler)
    }
    return new Promise2(() => {})
  }
}

export default Promise2