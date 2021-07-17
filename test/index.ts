import * as chai from 'chai';

const assert = chai.assert;

// mocha模块才有describe和it这两个方法
// 所以需要用mocha来运行该文件
// mocha -r ts-node/register test/index.ts
describe("Chai的使用", () => {
  it('测试', () => {
    assert(1 === 1)
  })
})