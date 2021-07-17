class Promise2 {
  onFulfilled = null
  onRejected = null
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise()必须接受一个函数')
    }
    fn(() => {
      setTimeout(() => {
        this.onFulfilled()
      }, 0)
    }, () => {})
  }
  then(onFulfilled, onRejected) {
    this.onFulfilled = onFulfilled
    this.onRejected = onRejected
  }
}

export default Promise2