import Vue from 'vue'
import {btn} from '@/help/config/btn.js'
let _this = new Vue()

export const firstUseUser = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  if (storageJson['isFirstUseImage'] !== 1) {
    _this.$intro()
      .setOptions({
        ...btn,
        steps: [
            {
                title:'消息功能',
                element:document.getElementById('user-message'),
                intro:'这是你的消息'
            },
            {
                title:'用户功能',
                element:document.getElementById('user-avator'),
                intro:'这是你的头像'
            }
        ],
      })
      .onbeforechange(function(targetElement){
        //每次引导之前先滚动到该元素所在的位置
        document.getElementById(targetElement.id).scrollIntoView({block: "end"})
      })
      .start()
    storageJson['isFirstUseImage'] = 1
    localStorage.setItem('firstUse', storageJson)
  }
}
