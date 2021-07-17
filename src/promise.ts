class Promise2 {
  onFulfilled = null
  onRejected = null
  resolve() {
    setTimeout(() => {
      this.onFulfilled()
    }, 0)
  }
  reject() {
    setTimeout(() => {
      this.onRejected()
    }, 0)
  }
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise()必须接受一个函数')
    }
    fn(this.resolve.bind(this), this.reject.bind(this))
  }
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

export default Promise2