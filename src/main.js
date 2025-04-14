import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store/index'
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from '@utils/i18n';
import less from 'less';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import 'element-ui/lib/theme-chalk/icon.css'
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import '@utils/directives';
import 'babel-polyfill';
import { shortcut } from '@utils/Keymaster.js';
import * as echarts from 'echarts';
import intro from 'intro.js'
import 'intro.js/introjs.css'
import btn from './directives/btn.js'
import VueCoreVideoPlayer from 'vue-core-video-player'

Vue.prototype.$serverUrl = ' http://192.168.51.67:8888/';
// Vue.prototype.$serverUrl = ' http://192.168.51.18:8002/';
Vue.prototype.$shortcut = shortcut;
Vue.prototype.$echarts = echarts;
Vue.prototype.$intro = intro;

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(less);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.use(btn);
Vue.use(VueCoreVideoPlayer);

const i18n = new VueI18n({
    locale: 'zh',
    messages
});

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    document.title = `${to.meta.title} | DeepLay`;
    const role = localStorage.getItem('ms_username');
    const role_type = localStorage.getItem('ms_user_type');
    if (role) {
        if (to.meta.role && to.meta.role != role_type) {
            next('*')
        }
        if (to.path == '/') {
            if (role_type == 'user') {
                next('/user_dashboard');
            } else if (role_type == 'admin') {
                next('/admin_dashboard');
            }
        } else {
            next();
        }
    } else {
        if (to.path == '/login' || to.path == '/'||to.path == '/register') {
            next();
        } else {
            if (role_type) {
                next('/login');
            } else {
                next('/');
            }
        }
    }
    /*    if (to.meta.permission) {
            // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
            role === 'admin' ? next() : next('/403');
        } else {
            // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
            if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
                Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
                    confirmButtonText: '确定'
                });
            } else {
                next();
            }
        }*/
});
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');



