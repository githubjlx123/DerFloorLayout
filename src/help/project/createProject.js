import Vue from 'vue'
import {btn} from '@/help/config/btn.js'
let _this = new Vue()

export const firstUseProject = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  if (storageJson['isFirstUseProject'] !== 1) {
    _this.$intro()
      .setOptions({
        ...btn,
        steps: [
            {
                title:'项目功能',
                element:document.getElementById('nav-project'),
                intro:'项目...'
            },
        ],
      })
      .onbeforechange(function(targetElement){
        //每次引导之前先滚动到该元素所在的位置
        document.getElementById(targetElement.id).scrollIntoView({block: "end"})
      })
      .start()
    storageJson['isFirstUseProject'] = 1
    localStorage.setItem('firstUse', JSON.stringify(storageJson))
  }
}
