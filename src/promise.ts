class Promise2 {
  constructor(fn) {
    if (typeof fn !== 'function') {
      throw new Error('new Promise()必须接受一个函数')
    }
    fn(() => {}, () => {})
  }
  then() {}
}

export default Promise2