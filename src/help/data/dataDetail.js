import Vue from 'vue'
import {btn} from '@/help/config/btn.js'
let _this = new Vue()

export const firstUseDataDetail = () => {
  let storageJson = JSON.parse(localStorage.getItem('firstUse'))
  storageJson = storageJson || {}
  if (storageJson['isFirstUseDataDetail'] !== 1) {
    _this.$intro()
      .setOptions({
        ...btn,
        steps: [
            {
                title:'数据集详细信息',
                element:document.getElementById('data-detail'),
                intro:'数据集...'
            },
            {
                title:'展示格式切换',
                element:document.getElementById('show-type-toggle'),
                intro:'可切换为卡片或者列表'
            },
            {
                title:'搜索功能',
                element:document.getElementById('data-show-search'),
                intro:'可通过类别或者图片名称搜索'
            },
            {
                title:'添加单张图',
                element:document.getElementById('add-one-image-data'),
                intro:'单张...'
            },
            {
                title:'批量添加图片',
                element:document.getElementById('add-images-data'),
                intro:'可上传压缩包'
            }
        ],
      })
      .onbeforechange(function(targetElement){
        //每次引导之前先滚动到该元素所在的位置
        document.getElementById(targetElement.id).scrollIntoView({block: "end"})
      })
      .start()
    storageJson['isFirstUseDataDetail'] = 1
    localStorage.setItem('firstUse', JSON.stringify(storageJson))
  }
}
