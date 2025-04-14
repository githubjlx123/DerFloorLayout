import { getSystemImagesByKey } from '@/api/Help.js'
import Vue from 'vue'
let _this = new Vue()
export async function keyToHtmlStrByHelp(key){
  let params = { key }
  await getSystemImagesByKey(params)
    .then((res) => {
      let {data,status} = res
      if (status == 200) {
        //生成引导内容的html字符串
        let imgAndInfoHtmlStr=`<img width="100%" src="${_this.$serverUrl}${data.file_path}?${Math.random()}">${data.detail}`
        localStorage.setItem('targetHelpInfo',imgAndInfoHtmlStr)
      } else {
        _this.$message.error(`获取资源列表失败:${msg}!`)
      }
    })
    .catch((error) => {
      _this.$message.error('获取资源列表失败!')
    })
}
