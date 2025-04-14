import Vue from 'vue'
import { btn } from '@/help/config/btn.js'
import { myPromiseAllByHelp } from '@utils/promiseAllByHelp.js'
import { getSystemImagesByKey } from '@/api/Help.js'

let _this = new Vue()

//首页详细信息引导
export const firstUseHomeInfo = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  const domIdList = [
    'new-model-status', 'project-count', 'my-project', 'my-data', 'new-model-info'
  ]
  let listReq = []
  domIdList.forEach((item, index) => {
    let params = { key: item }
    listReq.push(getSystemImagesByKey(params))
  })
  myPromiseAllByHelp(listReq).then(res=>{
    const results=JSON.parse(localStorage.getItem('targetHelpListByRequest'))
    if (storageJson['isFirstUseHomeInfo'] !== 1) {
      _this
        .$intro()
        .setOptions({
          ...btn,
          steps: [
            {
              title: '最新的模型训练状态',
              element: document.getElementById(domIdList[0]),
              intro: results[0],
              position: 'right',
            },
            {
              title: '项目汇总',
              element: document.getElementById(domIdList[1]),
              intro: results[1],
              position: 'bottom',
            },
            {
              title: '我的项目',
              element: document.getElementById(domIdList[2]),
              intro: results[2],
              position: 'bottom',
            },
            {
              title: '我的数据集',
              element: document.getElementById(domIdList[3]),
              intro: results[3],
              position: 'left',
            },
            {
              title: '最新的模型信息',
              element: document.getElementById(domIdList[4]),
              intro: results[4],
              position: 'top',
            },
          ],
        })
        .onbeforechange(function (targetElement) {
          //每次引导前就去加载需要的引导资源(前台的该元素id===后台的资源key)
          document.getElementById(targetElement.id).scrollIntoView({ block: 'end' })
        })
        .start()
      storageJson['isFirstUseHomeInfo'] = 1
      localStorage.setItem('firstUse', JSON.stringify(storageJson))
    }
  })
}
