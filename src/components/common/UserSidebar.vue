<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :id="item.name" :key="item.index">

            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>

            <template v-for="subItem in item.subs">

              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index">
                </el-menu-item>
              </el-submenu>

              <el-menu-item v-else :index="subItem.index" :key="subItem.index"> <i :class="subItem.icon"></i>{{ subItem.title }} </el-menu-item>

            </template>
          </el-submenu>
        </template>
        <template v-else>
          <el-menu-item :index="item.index" :key="item.index">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.title }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>

<script>
import EventBus from '@utils/bus.js'
import { firstUseNav } from '@/help/nav/nav.js'

export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'user_dashboard',
          title: '系统首页',
        },
        {
          icon: 'el-icon-lx-file',
          index: '333',
          title: '项目管理',
          name: 'nav-project',
          subs: [
            {
              icon: 'el-icon-folder-add',
              index: 'projectAddPage',
              title: '创建项目',
            },
            {
              icon: 'el-icon-folder-opened',
              index: 'projectListPage',
              title: '查看项目',
            },
          ],
        },
        {
          icon: 'el-icon-document',
          index: '444',
          title: '户型管理',
          name: 'nav-data',
          subs: [
            {
              icon: 'el-icon-document-add',
              index: 'houseAddPage',
              title: '创建户型',
            },
            {
              icon: 'el-icon-tickets',
              index: 'houseListPage',
              title: '查看户型',
            },
            {
              icon: 'el-icon-edit-outline',
              index: 'houseAnnotationPage',
              title: '户型标注',
            }
          ],
        },
        {
          icon: 'el-icon-lx-read',
          index: '555',
          title: '铺装管理',
          name: 'nav-model',
          subs: [
            {
              icon: 'el-icon-set-up',
              index: 'paveSimulatePage',
              title: '铺装模拟',
            },
            {
              icon: 'el-icon-postcard',
              index: 'paveListPage',
              title: '查看铺装结果',
            }
          ],
        },
        {
          icon: 'el-icon-lx-edit',
          index: '222',
          title: '信息管理',
          name: 'nav-message',
          subs: [
            {
              index: 'userUpdataMessage',
              title: '修改用户个人信息',
            },
            {
              index: 'userUpdatePassword',
              title: '修改密码',
            },
          ],
        },
        {
          icon: 'el-icon-notebook-2',
          index: 'feedBack',
          title: '意见反馈',
          name: 'nav-feed-back',
        },
      ],
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '')
    },
  },
  created() {
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    EventBus.$on('collapse', (msg) => {
      this.collapse = msg
      EventBus.$emit('collapse-content', msg)
      // this.showNavHelp()
    })
  },
  methods: {
    // //导航栏收缩结束且页面渲染完毕再进行引导
    // showNavHelp() {
    //     setTimeout(() => {
    //         firstUseNav()
    //     }, 1000)
    // },
  },
}
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}


<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 70px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 250px;
}

.sidebar > ul {
  height: 100%;
}

.sidebar >>> .el-submenu.is-opened > .el-submenu__title {
  background-color: #283446 !important;
}

/* 如果是在 scoped 样式中 */
.sidebar >>> .el-submenu.is-opened .el-menu-item {
  background-color: #283446 !important;
}

/* 如果放在全局样式（如 App.vue 或 main.css）中 */
.el-submenu.is-opened .el-menu-item {
  background-color: #283446 !important;
}

/* .sidebar >>> .el-submenu.is-opened .el-menu-item:hover {
  background-color: darkred !important;
} */

</style>
