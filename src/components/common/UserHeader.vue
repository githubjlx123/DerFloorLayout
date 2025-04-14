<template>
  <div class="header">
    <!-- 折叠按钮 -->
    <div class="collapse-btn" @click="collapseChage">
      <i v-if="!collapse" class="el-icon-s-fold"></i>
      <i v-else class="el-icon-s-unfold"></i>
    </div>
    <div class="logo">DeepLay-AI 铺装仿真引擎</div>
    <div class="header-right">
      <div class="header-user-con">
        <!-- 全屏显示 -->
        <div class="btn-fullscreen" @click="handleFullScreen">
          <el-tooltip effect="dark" :content="fullscreen ? `取消全屏` : `全屏`" placement="bottom">
            <i class="el-icon-rank"></i>
          </el-tooltip>
        </div>
        <!-- 用户头像 -->
        <div class="user-avator" id="user-avator">
          <img :src="show_user_image" />
        </div>
        <!-- 用户名下拉菜单 -->
        <el-dropdown class="user-name" trigger="click" @command="handleCommand">
          <span class="el-dropdown-link" :title="user_name">
            {{ user_name | filterName }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="/userUpdataMessage">我的信息</el-dropdown-item>
            <el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import EventBus from '@utils/bus.js'

export default {
  data() {
    return {
      user_id: localStorage.getItem('ms_user_id'),
      user_image: localStorage.getItem('ms_user_image'),
      show_user_image: '',
      user_name: localStorage.getItem('ms_username'),
      collapse: false,
      fullscreen: false
    }
  },
  filters: {
    filterName(name) {
      let resName = name
      if (!resName) {
        return 'unknown'
      } else if (resName.length > 10) {
        return resName.substring(0, 9) + '...'
      } else {
        return resName
      }
    },
  },
  created() {
    this.getUserImage()
    this.getUserName()
    this.accessNum()
    //指向问题先保存
    let that = this
    //这里是监听ESC的
    window.onresize = function () {
      if (!that.checkFull()) {
        // 退出全屏后要执行的动作
        that.fullscreen = false
      }
    }
  },
  mounted() {
    if (document.body.clientWidth < 1500) {
      this.collapseChage()
    }
    EventBus.$on('update', () => {
      this.getUserImage()
      this.getUserName()
    })
    //这里是监听F11案件的
    window.addEventListener('keydown', this.KeyDown, true) // 监听按键事件
  },
  updated() {},

  methods: {
    // 用户名下拉菜单选择事件
    handleCommand(command) {
      if (command == 'loginout') {
        localStorage.removeItem('ms_username')
        localStorage.removeItem('firstUse')
        this.$router.push('/login')
      } else {
        this.$router.push(command)
      }
    },
    // 侧边栏折叠
    collapseChage() {
      this.collapse = !this.collapse
      EventBus.$emit('collapse', this.collapse)
    },
    // 全屏事件
    handleFullScreen() {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    //监听解决F11打开后无法esc退出同时退出全屏的按钮也失效问题。
    KeyDown(event) {
      if (event.keyCode === 122) {
        event.returnValue = false
        this.handleFullScreen() //这里方的是触发全屏的方法
      }
    },
    //监听ESC事件，解决点击按钮全屏后按ESC退出再点击按钮不生效问题。
    checkFull() {
      //判断浏览器是否处于全屏状态 （需要考虑兼容问题）
      //火狐浏览器
      let isFull =
        document.mozFullScreen ||
        document.fullScreen ||
        //谷歌浏览器及Webkit内核浏览器
        document.webkitIsFullScreen ||
        document.webkitRequestFullScreen ||
        document.mozRequestFullScreen ||
        document.msFullscreenEnabled
      if (isFull === undefined) {
        isFull = false
      }
      return isFull
    },

    getUserImage() {
      this.user_image = localStorage.getItem('ms_user_image')
      this.show_user_image = `${this.$serverUrl}${this.user_image}?${new Date().getTime()}`
    },
    getUserName() {
      this.user_name = localStorage.getItem('ms_username')
    },
    //用户访问量
    accessNum() {
      let date = new Date()
      let lastDate = localStorage.getItem('last-action-date') ? localStorage.getItem('last-action-date') : ''
      if (lastDate != date.toLocaleDateString()) {
        localStorage.setItem('last-action-date', date.toLocaleDateString())
      }
    },
  },
}
</script>
<style scoped>
.header {
  position: relative;
  box-sizing: border-box;
  width: 100%;
  height: 70px;
  font-size: 22px;
  color: #fff;
}

.collapse-btn {
  float: left;
  padding: 0 21px;
  cursor: pointer;
  line-height: 70px;
}

.header .logo {
  float: left;
  width: 550px;
  line-height: 70px;
}

.header-right {
  float: right;
  padding-right: 50px;
}

.header-user-con {
  display: flex;
  height: 70px;
  align-items: center;
}

.btn-fullscreen {
  transform: rotate(45deg);
  margin-right: 5px;
  font-size: 24px;
}

.btn-bell,
.btn-fullscreen {
  position: relative;
  width: 30px;
  height: 30px;
  text-align: center;
  border-radius: 15px;
  cursor: pointer;
}

.btn-bell-badge {
  position: absolute;
  right: 0;
  top: -2px;
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: #f56c6c;
  color: #fff;
}

.btn-bell .el-icon-bell {
  color: #fff;
}

.user-name {
  margin-left: 10px;
}

.user-avator {
  margin-left: 20px;
}

.user-avator img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.el-dropdown-link {
  color: #fff;
  cursor: pointer;
}

.el-dropdown-menu__item {
  text-align: center;
}
</style>
