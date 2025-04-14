import Vue from 'vue'
import {btn} from '@/help/config/btn.js'
import EventBus from '@utils/bus.js';
import { myPromiseAllByHelp } from '@utils/promiseAllByHelp.js'
import { getSystemImagesByKey } from '@/api/Help.js'
let _this = new Vue()

//导航栏引导
export const firstUseNav = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  const domIdList = [
    'nav-project', 'nav-data', 'nav-model', 'nav-deploy', 'nav-test'
  ]
  let listReq = []
  domIdList.forEach((item, index) => {
    let params = { key: item }
    listReq.push(getSystemImagesByKey(params))
  })
  myPromiseAllByHelp(listReq).then(res=>{
    if (localStorage.getItem('ms_username') !== 'admin' && storageJson['isFirstUseNav'] !== 1) {
      const results=JSON.parse(localStorage.getItem('targetHelpListByRequest'))
      _this.$intro()
        .setOptions({
          ...btn,
          steps: [
              {
                  title:'项目功能',
                  element:document.getElementById(domIdList[0]),
                  intro:results[0]
              },
              {
                  title:'数据集功能',
                  element:document.getElementById(domIdList[1]),
                  intro:results[1]
              },
              {
                  title:'模型管理',
                  element:document.getElementById(domIdList[2]),
                  intro:results[2]
              },
              {
                  title:'部署管理',
                  element:document.getElementById(domIdList[3]),
                  intro:results[3],
                  position:'right'
              },
              {
                  title:'在线测试',
                  element:document.getElementById(domIdList[4]),
                  intro:results[4],
                  position:'right'
              }
          ],
        })
        .onbeforechange(function(targetElement){
          //每次引导之前先滚动到该元素所在的位置
          document.getElementById(targetElement.id).scrollIntoView({block: "end"})
        })
        .onexit(()=>{
          EventBus.$emit('firstUseNavOver',true)
        })
        .start()
        storageJson['isFirstUseNav'] = 1
        localStorage.setItem('firstUse', JSON.stringify(storageJson))
      }
  })
}
