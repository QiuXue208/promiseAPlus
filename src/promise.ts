import { type } from "os"

class Promise2 {
  // 存放 onFulfilled和onRejected
  callbacks = []
  state = 'pending'
  resolve(result) {
    if (this.state !== 'pending') return
    this.state = 'fulfilled'
    nextTick(() => {
      this.callbacks.forEach((handler) => {
        if (typeof handler[0] === 'function') {
          let fulfilledResult 
          try {
            fulfilledResult = handler[0].call(undefined, result)
          } catch(e) {
            return handler[2].reject(e)
          }
          // 将成功的值传给下一个promise
          handler[2].resolveWithX(fulfilledResult)
        }
      })
    })
  }
  reject(reason) {
    if (this.state !== 'pending') return
    this.state = 'rejected'
    nextTick(() => {
      this.callbacks.forEach((handler) => {
        if (typeof handler[1] === 'function') {
          let rejectedResult
          try {
            rejectedResult = handler[1].call(undefined, reason)
          } catch(e) {
            return handler[2].reject(e)
          }
          // 将失败的值传给下一个promise
          handler[2].resolveWithX(rejectedResult)
        }
      })
    })
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
        return this.reject(e)
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

// nextTick兼容浏览器环境
function nextTick(fn) {
  if (process !== undefined && typeof process.nextTick === 'function') {
    return process.nextTick(fn)
  } else {
    let counter = 1
    const observer = new MutationObserver(fn)
    const textNode = document.createTextNode(String(counter))

    observer.observe(textNode, {
      characterData: true
    })

    counter = counter + 1
    textNode.data = String(counter)
  }
}