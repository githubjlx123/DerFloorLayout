import axios from 'axios';
import storage from '@utils/storage.js'

const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    timeout: 600000
});

// service.interceptors.request.use(
//     config => {
//         // 设置请求头
//         //config.headers['token'] = localStorage.getItem("loginUserInfo").token;
//         let accessToken = localStorage.getItem('accessToken');
//         if (accessToken && accessToken !== '') {
//             config.headers.common['Authorization'] = accessToken;
//         }
//         return config;
//     },
//     error => {
//         console.log(error);
//         return Promise.reject(error);
//     }
// );

// 请求拦截
service.interceptors.request.use((req) => {
    // TO-DO
    const headers = req.headers;
    const { access_token = "" } = storage.getItem('userInfo') || {};
    if (!headers.Authorization) headers.Authorization = 'Bearer ' + access_token;
    return req;
})


service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            // 回设置token start
            let accessToken = response.headers['authorization'];
            if (accessToken && accessToken !== '') {
                localStorage.setItem('accessToken', accessToken);
            }
            return response.data;
        } 
        // else {
        //     if (response.status === 401) {
        //         // 返回状态为401，强制返回到登录页
        //         // 例如，使用Vue Router进行页面跳转
        //         router.push('/login');
        //     } else if (response && response.data && response.data.error) {
        //         // 处理其他错误信息
        //         const error = new Error(response.data.error);
        //         return Promise.reject(error);
        //     } else {
        //         // 处理其他响应错误
        //         const error = new Error(`请求错误，状态码：${response.status}`);
        //         return Promise.reject(error);
        //     }
        // }
        else {
            if (error && error.response) {
                switch (error.response.status) {
                    case 400:
                        error.message = `错误请求`;
                        break;
                    case 401:
                        error.message = `未授权，请重新登录`;
                        break;
                    case 403:
                        error.message = `拒绝访问`;
                        break;
                    case 404:
                        error.message = `请求错误,未找到该资源`;
                        break;
                    case 405:
                        error.message = `请求方法未允许`;
                        break;
                    case 408:
                        error.message = `请求超时`;
                        break;
                    case 500:
                        error.message = `服务器端出错`;
                        break;
                    case 501:
                        error.message = `网络未实现`;
                        break;
                    case 502:
                        error.message = `网络错误`;
                        break;
                    case 503:
                        error.message = `服务不可用`;
                        break;
                    case 504:
                        error.message = `网络超时`;
                        break;
                    case 505:
                        error.message = `http版本不支持该请求`;
                        break;
                    default:
                        error.message = `未知错误${error.response.status}`;
                }
            } else {
                error.message = "连接到服务器失败";
            }
           return Promise.reject(error);
        }
    },
    error => {
        console.log(error);
        return Promise.reject(error);
    }
);

export default service;
