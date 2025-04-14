# 配置文档 #
## 官方配置链接 ##
https://introjs.com/docs/examples/basic/hello-world
## 开发者使用规范 ##
### 所有引导 ###
所有引导的显示数据
let json = localStorage.getItem('firstUse')
删除这个对象即代表重新进行引导
### 单个引导 ###
单个引导的显示数据
json['isFirstUseImage']
值为1代表不需要引导,为0或undefined代表需要引导
### 引导资源(例如gif)的展示 ###
1、后台管理系统增加指定key的gif资源
2、前台系统每一个引导dom元素的id===后台的key
3、每次引导触发前,都会先去请求该id对应的引导资源,通过keyToHtmlStrByHelp.js生成html字符串存到本地targetHelpInfo
4、本地targetHelpInfo文件只保存一个引导内容,后来的引导会替换前面的引导字符串
5、如果该引导不需要请求资源,那么就要给该元素设置自定义属性isNotNeedRequestByHelp为true,不设置或设置为false,即认为需要请求引导资源(读取本地数据),不过就需要自己给intro设置引导值了,
6、后台可通过key对该引导内容修改引导资源file_path与资源detail