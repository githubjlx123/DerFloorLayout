<template>
  <div class="sidebar">
    <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-submenu :index="item.index" :key="item.index">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                <template slot="title">{{ subItem.title }}</template>
                <el-menu-item v-for="(threeItem, i) in subItem.subs" :key="i" :index="threeItem.index"> {{ threeItem.title }}</el-menu-item>
              </el-submenu>
              <el-menu-item v-else :index="subItem.index" :key="subItem.index">{{ subItem.title }} </el-menu-item>
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
export default {
  data() {
    return {
      collapse: false,
      items: [
        {
          icon: 'el-icon-lx-home',
          index: 'admin_dashboard',
          title: '系统首页',
        },
        {
          icon: 'el-icon-lx-message',
          index: '2',
          title: '消息管理',
          subs: [
            {
              index: 'admin_addMessagePage',
              title: '发布消息',
            },
            {
              index: 'admin_showMessageList',
              title: '查看消息',
            },
          ],
        },
        {
          icon: 'el-icon-mobile',
          index: 'admin_app',
          title: 'App管理',
          subs: [
            {
              index: 'admin_app_home',
              title: '首页管理',
              subs: [
                {
                  index: 'admin_app_home_slide',
                  title: '首页轮播图',
                },
                {
                  index: 'admin_app_home_advertising',
                  title: '广告管理',
                },
              ],
            },
            {
              index: 'admin_app_article',
              title: '文章管理',
			  icon: 'el-icon-reading',
			  subs: [
                {
                  index: 'admin_app_article_add',
                  title: '添加文章',
                },
                {
                  index: 'admin_app_article_list',
                  title: '查看文章',
                },
              ],
            },
            {
              index: 'admin_app_system',
              title: '系统管理',
            },
          ],
        },
        {
          icon: 'el-icon-lx-copy',
          index: '2233',
          title: '用户管理',
          subs: [
            {
              index: 'admin_addUserPage',
              title: '添加用户',
            },
            {
              index: 'admin_showUserPage',
              title: '查看用户',
            },
          ],
        },
        {
          icon: 'el-icon-lx-file',
          index: 'admin_projectInfo',
          title: '项目信息',
        },
        {
          icon: 'el-icon-lx-pic',
          index: 'admin_datasetList',
          title: '数据集信息',
        },
        {
          icon: 'el-icon-lx-read',
          index: 'admin_modelList',
          title: '模型信息',
        },
        {
          icon: 'el-icon-upload',
          index: 'admin_uploadModel',
          title: '上传算法',
        },
        {
          icon: 'el-icon-document',
          index: 'algorithm_anagement',
          title: '算法管理'
        },
        {
          icon: 'el-icon-menu',
          index: 'admin_deployList',
          title: '部署信息',
        },
        {
          icon: 'el-icon-question',
          index: 'admin_help',
          title: '引导管理',
          subs: [
            {
              index: 'admin_addHelp',
              title: '添加引导',
            },
            {
              index: 'admin_helpList',
              title: '查看引导',
            },
          ],
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
    })
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
</style>
