import Vue from 'vue'
import { btn } from '@/help/config/btn.js'
import { myPromiseAllByHelp } from '@utils/promiseAllByHelp.js'
import { getSystemImagesByKey } from '@/api/Help.js'
let _this = new Vue()

export const firstUseUserModelDetail = () => {
  const domIdList = [
    'model-info', 'model-status', 'model-loss-line'
  ]
  let listReq = []
  domIdList.forEach((item, index) => {
    let params = { key: item }
    listReq.push(getSystemImagesByKey(params))
  })
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  myPromiseAllByHelp(listReq).then((res) => {
    const results=JSON.parse(localStorage.getItem('targetHelpListByRequest'))
    if (storageJson['isFirstUserModelDetail'] !== 1) {
      _this
        .$intro()
        .setOptions({
          ...btn,
          steps: [
            {
              title: '模型详细信息',
              element: document.getElementById(domIdList[0]),
              intro: results[0],
            },
            {
              title: '模型训练状态',
              element: document.getElementById(domIdList[1]),
              intro: results[1],
              position:'left'
            },
            {
              title: '模型损失详细信息',
              element: document.getElementById(domIdList[2]),
              intro: results[2],
              position:'right'
            },
          ],
        })
        .onbeforechange(function (targetElement) {
          //每次引导之前先滚动到该元素所在的位置
          document.getElementById(targetElement.id).scrollIntoView({ block: 'end' })
        })
        .start()
      storageJson['isFirstUserModelDetail'] = 1
      localStorage.setItem('firstUse', JSON.stringify(storageJson))
    }
  })
}
