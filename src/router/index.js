import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
        return originalPush.call(this, location, onResolve, onReject);
    }
    return originalPush.call(this, location).catch(err => err);
};

Vue.use(Router);
export default new Router({
    mode: 'hash',
    routes: [
        {
            path: '/',
            // component: () => import(/* webpackChunkName: "home" */ '@components/page/index.vue'),
            component: () => import(/* webpackChunkName: "home" */ '../components/page/Login/Login.vue'),
            meta: { title: '欢迎' }
        },
        // 用户端主页面
        {
            path: '/user',
            redirect: '/user_dashboard'
        },
        // 管理端主页面
        {
            path: '/admin',
            redirect: '/admin_dashboard'
        },

        {
            path: '/admin',
            component: () => import(/* webpackChunkName: "home" */ '@components/common/AdminHome.vue'),
            meta: { title: '自述文件', role: 'admin' },
            children: [
                {
                    path: '/admin_dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@components/page/AdminHome/AdminHome.vue'),
                    meta: { title: '管理员首页', role: 'admin' }
                },
                {
                    // 管理员_发布消息
                    path: '/admin_addMessagePage',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminMessage/AdminMessageAdd.vue'),
                    meta: { title: '发布消息', role: 'admin' }
                },
                {
                    // 管理员_添加app文章
                    path: '/admin_app_article_add',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminAppManage/AdminAppArticleManage/AddArticle.vue'),
                    meta: { title: '添加app文章', role: 'admin' }
                },
                {
                    // 管理员_查看app文章列表
                    path: '/admin_app_article_list',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminAppManage/AdminAppArticleManage/ArticleList.vue'),
                    meta: { title: '查看app文章列表', role: 'admin' }
                },
                {
                    // 管理员_查看app首页轮播图
                    path: '/admin_app_home_slide',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminAppManage/AdminAppSlideManage/Slide.vue'),
                    meta: { title: '查看app首页轮播图', role: 'admin' }
                },
                {
                    // 管理员_查看app首页广告
                    path: '/admin_app_home_advertising',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminAppManage/AdminAppSlideManage/Advertising.vue'),
                    meta: { title: '查看app首页广告', role: 'admin' }
                },
                {
                    // 管理员_查看app系统管理
                    path: '/admin_app_system',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminAppManage/AdminAppSystemManage/SystemManage.vue'),
                    meta: { title: '查看app系统管理', role: 'admin' }
                },
                {
                    // 管理员_查看消息
                    path: '/admin_showMessageList',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminMessage/AdminMessageList.vue'),
                    meta: { title: '查看消息', role: 'admin' },
                    name: 'admin_showMessageList'
                },
                {
                    // 管理员_添加用户页面
                    path: '/admin_addUserPage',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminUserManage/AdminUserAdd.vue'),
                    meta: { title: '添加用户', role: 'admin' }
                },
                {
                    // 管理员_查看用户信息页面
                    path: '/admin_showUserPage',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminUserManage/AdminUserList.vue'),
                    meta: { title: '查看用户信息', role: 'admin' }
                },
                {
                    // 管理员_项目管理
                    path: '/admin_projectInfo',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminProjectManage/AdminProjectInfo.vue'),
                    meta: { title: '项目信息', role: 'admin' }
                },
                {
                    // 管理员_项目管理
                    path: '/admin_projectDetail',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminProjectManage/ProjectDetail'),
                    meta: { title: '项目详情', role: 'admin' }
                },
                {
                    // 管理员_户型列表
                    path: '/admin_datasetList',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminDatasetManage/DatasetList'),
                    meta: { title: '户型信息', role: 'admin' }
                },
                {
                    // 管理员_户型详情
                    path: '/admin_datasetDetail',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminDatasetManage/DatasetDetail'),
                    meta: { title: '户型详情', role: 'admin' }
                },
                {
                    // 管理员_铺装列表
                    path: '/admin_modelList',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminModelManage/ModelList'),
                    meta: { title: '铺装信息', role: 'admin' }
                },
                {
                    // 管理员_铺装详情
                    path: '/admin_modelDetail',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminModelManage/ModelDetail'),
                    meta: { title: '铺装详情', role: 'admin' }
                },
                {
                    // 管理员_部署列表
                    path: '/admin_deployList',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminDeployManage/DeployList'),
                    meta: { title: '部署信息', role: 'admin' }
                },
                {
                    // 管理员_添加引导资源
                    path: '/admin_addHelp',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminHelpManage/AddHelp'),
                    meta: { title: '添加引导资源', role: 'admin' }
                },
                {
                    // 管理员_查看引导资源
                    path: '/admin_helpList',
                    component: () => import(/* webpackChunkName: "permission" */ '@components/page/AdminHelpManage/HelpList'),
                    meta: { title: '查看引导资源', role: 'admin' }
                }
            ]
        },

        {
            path: '/user',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/UserHome.vue'),
            meta: { title: '自述文件', role: 'user' },
            children: [
                {
                    path: '/user_dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '@components/page/UserHome/UserDashboard.vue'),
                    meta: { title: '系统首页', role: 'user' }
                },
                {
                    path: '/userMessageList',
                    name: 'userMessageList',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/UserMessageManage/UserMessageList.vue'),
                    meta: { title: '消息中心', role: 'user' }
                },
                {
                    // 用户_修改用户信息
                    path: '/userUpdataMessage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserInfoManage/UserInfoUpdate.vue'),
                    meta: { title: '修改信息', role: 'user' }
                },
                {
                    // 用户_修改密码页面
                    path: '/userUpDatePassword',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserInfoManage/UserPasswordUpdate.vue'),
                    meta: { title: '修改密码', role: 'user' }
                },
                {
                    // 用户_添加项目页面
                    path: '/projectAddPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserProjectManage/UserProjectAdd.vue'),
                    meta: { title: '添加项目', role: 'user' }
                },
                {
                    // 用户_查看项目信息页面
                    path: '/projectListPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserProjectManage/UserProjectList.vue'),
                    meta: { title: '查看项目', role: 'user' }
                },
                {
                    // 用户_查看项目信息页面
                    path: '/projectDetailPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserProjectManage/UserProjectDetail.vue'),
                    meta: { title: '项目详情', role: 'user' }
                },
                {
                    // 用户_添加户型页面
                    path: '/houseAddPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserHouseManage/UserHouseAdd.vue'),
                    meta: { title: '添加户型', role: 'user' },
                    name: 'houseAddPage'
                },
                {
                    // 用户_查看户型信息页面
                    path: '/houseListPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserHouseManage/UserHouseList.vue'),
                    meta: { title: '查看户型', role: 'user' }
                },
                {
                    // 用户_查看户型详细信息页面
                    name: 'houseDetailPage',
                    path: '/houseDetailPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserHouseManage/UserHouseDetail.vue'),
                    meta: { title: '户型详情', role: 'user' }
                },
                {
                    // 用户_标注户型页面
                    path: '/houseAnnotationPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserHouseManage/UserHouseAnnotationList.vue'),
                    meta: { title: '户型标注', role: 'user' }
                },
                {
                    // 用户_标注检测户型页面
                    path: '/toUserHouseAnnotationPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserHouseManage/UserHouseAnnotation.vue'),
                    meta: { title: '户型标注页面', role: 'user' },
                },
                {
                    // 用户_铺装管理_训练铺装
                    path: '/paveSimulatePage',
                    name: 'paveSimulatePage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserPaveManage/UserPaveSimulate.vue'),
                    meta: { title: '铺装模拟', role: 'user' }
                },
                    // 用户_铺装管理_查看铺装
                {
                    path: '/paveListPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserPaveManage/UserPaveList.vue'),
                    meta: { title: '查看铺装', role: 'user' }
                },
                {
                    // 用户_铺装管理_查看铺装_详细信息
                    path: '/paveDetailPage',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserPaveManage/UserPaveDetail.vue'),
                    meta: { title: '铺装详细信息', role: 'user' }
                },
                
                {
                    // 用户_意见反馈
                    path: '/feedBack',
                    name: 'feedBack',
                    component: () => import(/* webpackChunkName: "permission" */ '../components/page/UserFeedBack/FeedBack.vue'),
                    meta: { title: '意见反馈', role: 'user' }
                },
                // {
                //     path: '*',
                //     component: () => import(/* webpackChunkName: "404" */ '../components/page/WarningPage/404.vue'),
                //     meta: { title: '404', role: 'user' }
                // }
            ]
        },

        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '/register',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/Login/Register.vue'),
            meta: { title: '注册' }
        },
        {
            path: '*',
            component: () => import(/* webpackChunkName: "login" */ '../components/page/WarningPage/404.vue'),
            meta: { title: '页面找不到' }
        }
    ]
});
