<template>
    <div class="wrapper">
        <v-head></v-head>
        <v-sidebar></v-sidebar>
        <div class="content-box" :class="{'content-collapse':collapse}">
            <v-tags></v-tags>
            <div class="content">
                <transition name="move" mode="out-in">
                    <keep-alive :include="tagsList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
                <el-backtop target=".content"></el-backtop>
            </div>
        </div>
    </div>
</template>

<script>
import vHead from './UserHeader.vue';
import vSidebar from './UserSidebar.vue';
import vTags from './UserTags.vue';
import EventBus from '@utils/bus.js';
import {addActionUserId} from '@/api/Login.js'
export default {
    data() {
        return {
            tagsList: [],
            collapse: false,
            user_id: localStorage.getItem('ms_user_id'),
            timer:null,
        };
    },
    components: {
        vHead,
        vSidebar,
        vTags
    },
    created() {
        EventBus.$on('collapse-content', msg => {
            this.collapse = msg;
        });

        // 只有在标签页列表里的页面才使用keep-alive，即关闭标签之后就不保存到内存中了。
        EventBus.$on('tags', msg => {
            let arr = [];
            for (let i = 0, len = msg.length; i < len; i++) {
                msg[i].name && arr.push(msg[i].name);
            }
            this.tagsList = arr;
        });
    },
    mounted() {
        this.actionUser();
        this.openInterval();
    },
    methods:{
        actionUser(){
            let params = {
                user_id:this.user_id
            }
            addActionUserId(params).then(res =>{})
        },
        openInterval(){
            this.timer = setInterval(()=>{
                this.actionUser();
            },1800 * 1000)
        },
        stopInterval(){
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
        }
    },
    beforeDestroy() {
        this.stopInterval();
    }
};
</script>
