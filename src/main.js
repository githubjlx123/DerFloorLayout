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
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

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
if (process.env.NODE_ENV === 'development') {
    const mock = new MockAdapter(axios, { delayResponse: 500 }); // 模拟网络延迟

    const fakeRoomData = {
        status: 200,
        msg: "数据获取成功",
        data: {
            room_list: [
                {
                    id: 23,
                    name: "房间1",
                    is_label: 1,
                    room_data: [
                        [0, 3225], [0, 5765], [1400, 5765], [1400, 4865],
                        [1620, 4865], [1620, 5765], [4920, 5765], [4920, 3225],
                        [1620, 3225], [1620, 3430], [1400, 3430], [1400, 3225]
                    ],
                    default_start_x: 0,
                    default_start_y: 0,
                    data_max_x: 0,
                    data_max_y: 0,
                    room_area: 12253700.0,
                    room_length: 17130.0
                },
                {
                    id: 24,
                    name: "房间2",
                    is_label: 1,
                    room_data: [
                        [1630, 5995], [1630, 7160], [890, 7160], [890, 8905],
                        [1630, 8905], [1630, 9525], [4920, 9525], [4920, 5995]
                    ],
                    default_start_x: 0,
                    default_start_y: 0,
                    data_max_x: 0,
                    data_max_y: 0,
                    room_area: 12905000.0,
                    room_length: 15120.0
                },
                {
                    id: 26,
                    name: "房间3",
                    is_label: 1,
                    room_data: [
                        [0, 0], [0, 5770], [3380, 5770], [3380, 5270],
                        [3500, 5270], [3500, 5770], [4010, 5770], [4010, 6010],
                        [0, 6010], [0, 9790], [3190, 9790], [3190, 7090],
                        [4060, 7090], [4060, 7210], [3310, 7210], [3310, 9790],
                        [5010, 9790], [5010, 7210], [4860, 7210], [4860, 7090],
                        [5010, 7090], [5010, 6010], [4910, 6010], [4910, 5770],
                        [5250, 5770], [5250, 7130], [8850, 7130], [8850, 3290],
                        [8660, 3290], [8660, 3170], [7860, 3170], [7860, 3290],
                        [7030, 3290], [7030, 3170], [3500, 3170], [3500, 4470],
                        [3380, 4470], [3380, 0]
                    ],
                    default_start_x: 0,
                    default_start_y: 0,
                    data_max_x: 0,
                    data_max_y: 0,
                    room_area: 57004000.0,
                    room_length: 59260.0
                }
            ],
            label_num: 3,
            total_num: 3
        }
    };

    mock.onPost('http://192.168.51.67:8888/getAnnotationHouseById').reply(config => {
        console.log('Mock 请求参数:', config.data);
        return [200, fakeRoomData];
    });
}
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

});
new Vue({
    router,
    store,
    i18n,
    render: h => h(App)
}).$mount('#app');


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


