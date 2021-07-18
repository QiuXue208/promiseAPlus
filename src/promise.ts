import { type } from "os"

class Promise2 {
  // 存放 onFulfilled和onRejected
  callbacks = []
  state = 'pending'
  resolve(result) {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    setTimeout(() => {
      this.callbacks.forEach((handler) => {
        if (typeof handler[0] === 'function') {
          const fulfilledResult = handler[0].call(undefined, result)
          // 将成功的值传给下一个promise
          handler[2].resolveWithX(fulfilledResult)
        }
      })
    }, 0)
  }
  reject(reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    setTimeout(() => {
      this.callbacks.forEach((handler) => {
        if (typeof handler[1] === 'function') {
          const rejectedResult = handler[1].call(undefined, reason)
          // 将失败的值传给下一个promise
          handler[2].resolveWithX(rejectedResult)
        }
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
    handler[2] = new Promise2(() => {})
    this.callbacks.push(handler)
    return handler[2]
  }
  resolveWithX(x) {
    // this是指的调用then方法返回的promise
    if (this === x) {
      this.reject(new TypeError())
    } else if (x instanceof Promise2) {
      x.then(result => {
        this.resolve(result)
      }, reason => {
        this.reject(reason)
      })
    } else if (x instanceof Object) {
      let then
      try {
        then = x.then
      } catch (e) {
        this.reject(e)
      }
      if (then instanceof Function) {
        try {
          x.then((y) => {
            this.resolveWithX(y)
          }, (r) => {
            this.reject(r)
          })
        } catch(e) {
          this.reject(e)
        }
      } else {
        this.resolve(x)
      }
    } else {
      this.resolve(x)
    }
  }
}

export default Promise2