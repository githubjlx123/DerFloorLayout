<template>
  <div>
    <div class="btn-question-help" id="user-message">
      <el-tooltip effect="dark" content="开启引导模式" placement="bottom">
        <i class="el-icon-question"></i>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HelpButton',
  methods: {
    //每一个功能引导都有一个基于loaclStorage设置的key,该方法可以切换该key的值,从而在组件里 再 调用功能引导就会显示
    toggleLocalstorage(key) {
      let storageJson = JSON.parse(localStorage.getItem('firstUse'))
      storageJson = storageJson || {}
      storageJson[key] = 0
      localStorage.setItem('firstUse', JSON.stringify(storageJson))
    },
  },
}
</script>

<style scoped lang="less">
.btn-question-help {
  position: fixed;
  bottom: 80px;
  right: 45px;
  color: skyblue;
  font-size: 32px;
  cursor: pointer;
}
</style>
