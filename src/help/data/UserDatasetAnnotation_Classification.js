import Vue from 'vue'
import { btn } from '@/help/config/btn.js'
import { myPromiseAllByHelp } from '@utils/promiseAllByHelp.js'
import { getSystemImagesByKey } from '@/api/Help.js'
let _this = new Vue()

export const firstUseUserDatasetAnnotation_Classification = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  const domIdList = ['edit-data-type-c', 'delete-data-c','type-manage-c', 'next-image-c',]
  let listReq = []
  domIdList.forEach((item, index) => {
    let params = { key: item }
    listReq.push(getSystemImagesByKey(params))
  })
  storageJson = storageJson || {}
  myPromiseAllByHelp(listReq).then((res) => {
    const results = JSON.parse(localStorage.getItem('targetHelpListByRequest'))
    if (storageJson['isFirstUseUserDatasetAnnotation_Classification'] !== 1) {
      _this
        .$intro()
        .setOptions({
          ...btn,
          steps: [
            {
              title: '编辑类别',
              element: document.getElementById(domIdList[0]),
              intro: results[0],
            },
            {
              title: '删除类别',
              element: document.getElementById(domIdList[1]) || document.getElementById('delete-data-null'),
              intro: results[1],
            },
            {
              title: '类别管理',
              element: document.getElementById(domIdList[2]),
              intro: results[2],
              position:'right'
            },
            {
              title: '图片切换',
              element: document.getElementById(domIdList[3]),
              intro: results[3],
            },
          ],
        })
        .onbeforechange(function (targetElement) {
          //每次引导之前先滚动到该元素所在的位置
          document.getElementById(targetElement.id).scrollIntoView({ block: 'end' })
        })
        .start()
      storageJson['isFirstUseUserDatasetAnnotation_Classification'] = 1
      localStorage.setItem('firstUse', JSON.stringify(storageJson))
    }
  })
}
