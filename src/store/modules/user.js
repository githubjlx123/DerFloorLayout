/*import { getToken,removeToken } from '@/common/auth.js';*/
import { login } from '@/api/Login.js';
const state={   //要设置的全局访问的state对象
    is_login: false,
    curr_uid:'',
    curr_user_typ:'',
    curr_username:'',
    curr_user_status:'',
    curr_user_detail:'',
    curr_user_email:'',
    curr_user_last_local:'',
    curr_user_last_login_time:'',

    //要设置的初始属性值
};
const getters = {   //实时监听state值的变化(最新状态)
    isLogin(state) {  //承载变化的showFooter的值
        return state.is_login
    },
    getCurrUid(state){  //承载变化的curr_uid的值
        return state.curr_uid
    }
};
const mutations = {
    setLogin(state) {   //自定义改变state初始值的方法，这里面的参数除了state之外还可以再传额外的参数(变量或对象);
        state.is_login = true;
    },
    setLogout(state) {  //同上
        state.is_login = false;
    },
    setCurrUid(state,uid){ //同上，这里面的参数除了state之外还传了需要增加的值sum
        state.curr_uid=uid;
    }
};
const actions = {
    setLogin(context) {  //自定义触发mutations里函数的方法，context与store 实例具有相同方法和属性
        
    },
    setLogout(context) {  //同上注释

    },
    setCurrUid(context,uid){   //同上注释，uid为要变化的形参

    }
};
export default {
    namespaced: true, //用于在全局引用此文里的方法时标识这一个的文件名
    state,
    getters,
    mutations,
    actions
}