import Vue from 'vue';
import Vuex from 'vuex';
import user from '@store/modules/user'
import detectionData from '@store/modules/detectionData'
import loginData from '@store/modules/loginData'

Vue.use(Vuex);
// 用来存储数据
const state = {
};
// 用来将state数据进行加工
const getters = {};
// 操作数据
const mutations = {};
// 响应组件中的事件
const actions = {
    test(context,value){
    },
};
// 新建并暴露store
export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules:{
        user,
        detectionData,
        loginData
    }
});
