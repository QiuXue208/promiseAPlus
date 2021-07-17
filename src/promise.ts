import { type } from "os"

class Promise2 {
  onFulfilled = null
  onRejected = null
  state = 'pending'
  resolve() {
    setTimeout(() => {
      if (typeof this.onFulfilled === 'function') {
        this.onFulfilled()
      }
    }, 0)
  }
  reject() {
    setTimeout(() => {
      if (typeof this.onRejected === 'function') {
        this.onRejected()
      }
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise()必须接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(onFulfilled?, onRejected?) {
    if (typeof onFulfilled === 'function') {
      this.onFulfilled = onFulfilled
    }
    if (typeof onRejected === 'function') {
      this.onRejected = onRejected
    }
  }
}

export default Promise2