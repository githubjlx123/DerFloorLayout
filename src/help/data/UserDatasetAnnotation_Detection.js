import Vue from 'vue'
import {btn} from '@/help/config/btn.js'
import { myPromiseAllByHelp } from '@utils/promiseAllByHelp.js'
import { getSystemImagesByKey } from '@/api/Help.js'
let _this = new Vue()

export const firstUseUserDatasetAnnotation_Detection = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  const domIdList = [
    'draw-ract','canvas', 'type-name', 'delete-data', 'edit-data-type','is-show-result',
    'auto-annnotation','history-content','next-image-data'
  ]
  let listReq = []
  domIdList.forEach((item, index) => {
    let params = { key: item }
    listReq.push(getSystemImagesByKey(params))
  })
  storageJson = storageJson || {}
  myPromiseAllByHelp(listReq).then(res=>{
    const results=JSON.parse(localStorage.getItem('targetHelpListByRequest'))
    if (storageJson['isFirstUseUserDatasetAnnotation_Detection'] !== 1) {
      _this.$intro()
        .setOptions({
          ...btn,
          steps: [
              {
                  title:'增加标注',
                  element:document.getElementById(domIdList[0]),
                  intro:results[0],
                  position:'top'
              },
              {
                  title:'双击矩形框',
                  element:document.getElementById(domIdList[1]),
                  position: 'left',
                  intro:results[1],
                  position:'right'
              },
              {
                  title:'移动矩形框',
                  element:document.getElementById(domIdList[2]),
                  position: 'left',
                  intro:results[2]
              },
              {
                  title:'删除类别',
                  element:document.getElementById(domIdList[3]),
                  intro:results[3]
              },
              {
                  title:'修改标注名称',
                  element:document.getElementById(domIdList[4]),
                  intro:results[4]
              },
              {
                  title:'标注结果',
                  element:document.getElementById(domIdList[5]),
                  intro:results[5]
              },
              {
                  title:'自动标注',
                  element:document.getElementById(domIdList[6]),
                  intro:results[6]
              },
              {
                  title:'历史记录',
                  element:document.getElementById(domIdList[7]),
                  intro:results[7]
              },
              {
                  title:'图片切换',
                  element:document.getElementById(domIdList[8]),
                  intro:results[8]
              },
          ],
        })
        .onbeforechange(function(targetElement){
          //每次引导之前先滚动到该元素所在的位置
          document.getElementById(targetElement.id).scrollIntoView({block: "end"})
        })
        .start()
      storageJson['isFirstUseUserDatasetAnnotation_Detection'] = 1
      localStorage.setItem('firstUse', JSON.stringify(storageJson))
    }
  })
}
