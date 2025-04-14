
import Vue from 'vue'
let _this = new Vue()
/**
 * 由于intro中setOptions配置项所有的intro是在开始引导前全部初始化完成的,后续无法正常改变了,
 * 所有需要一个异步函数阻塞这个初始化操作,并且异步函数的结果作为初始化操作的每一个值
 * @param {*} list 页面中所有需要引导的请求列表
 * @returns 异步函数的结果保存到本地存储
 */
export function myPromiseAllByHelp(list) {
  let results = {}
  let count = 0
  return new Promise((resolve, reject) => {
    function addData(index, res) {
      let { data, status, msg } = res
      status !== 200 && reject(msg)
      results[index] = `<img width="100%" src="${_this.$serverUrl}${data.file_path}?${Math.random()}">${data.detail}`
      count++
      if (count === list.length) {
        localStorage.setItem('targetHelpListByRequest', JSON.stringify(results))
        resolve(results)
      }
    }
    list.map((promise, index) => {
      if (promise instanceof Promise) {
        promise.then(
          (res) => {
            addData(index, res)
          },
          (reason) => {
            reject(reason)
          }
        )
      } else {
        addData(index, promise)
      }
    })
  })
}
