<template>
    <div class="login-wrap">
        <div class="login-main">
            <div class="main-panel">
                <div class="panel-left">
                    <img src="@assets/img/Login/img_left.png" class="left-image" />
                </div>
                <div class="panel-right">
                    <div class="panel-head">
                        <div class="head-line-left"></div>
                        <div class="head-title">DeepLay-AI 智能铺装登录</div>
                        <div class="head-line-right"></div>
                    </div>
                    <el-form :model="form" :rules="rules" ref="login">
                        <el-form-item prop="email">
                            <el-input v-model="form.email" placeholder="邮箱" class="inputLength">
                                <i slot="prefix" class="el-icon-user"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                type="password"
                                placeholder="密码"
                                v-model="form.password"
                                @keyup.enter.native="submitForm()"
                                class="inputLength"
                            >
                                <i slot="prefix" class="el-icon-key"></i>
                            </el-input>
                        </el-form-item>
                        <div class="tip">Tips : 请输入您的邮箱与密码。</div>
                        <div class="login-btn" @click="submitForm()">登录</div>
                        <div class="register-btn" @click="register">注册</div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { login } from '@/api/Login.js';
import MapLoader from '@utils/map.js';
import md5 from 'js-md5';

/*import {mapState,mapActions,} from "vuex";*/

export default {
    data: function () {
        return {
            form: {
                email: '',
                password: ''
            }, //登录表单
            rules: {
                email: [
                    { required: true, message: '  ', trigger: 'blur' },
                    {
                        required: true,
                        message: '请输入合法邮箱',
                        trigger: 'blur',
                        pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                    }
                ],
                password: [
                    {
                        required: true,
                        message: '  ',
                        trigger: 'blur'
                    }
                ]
            } //规则
        };
    },
    mounted() {
        this.getLocal();
    },
    methods: {
        ...mapMutations('loginData', [
        'saveUserInfo'
        ]),
        //获取当前地址
        getLocal() {
            let _that = this;
            MapLoader().then((AMap) => {
                AMap.plugin('AMap.Geolocation', () => {
                    let geolocation = new AMap.Geolocation({
                        // 是否使用高精度定位，默认：true
                        enableHighAccuracy: true,
                        // 设置定位超时时间，默认：无穷大
                        timeout: 10000
                    });
                    geolocation.getCityInfo((status, result) => {
                        //只能获取当前用户所在城市和城市的经纬度
                        if (status == 'complete') {
                            let province = result.province ? result.province : '';
                            let city = result.city ? result.city : '';
                            _that.local = `${province}${city}`;
                        }
                    });
                });
            });
        },
        //登录
        submitForm() {
            let md5Password = md5('DeepLay' + this.form.password);
            let params = {
                email: this.form.email,
                password: md5Password,
                local: this.local
            };
            /*   this.$store.dispatch('test',params)*/
            login(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == '200') {
                        this.$message.success('登录成功');
                        // console.log(res);
                        this.$store.commit('saveUserInfo', res);

                        localStorage.setItem('ms_user_id', data.id);
                        localStorage.setItem('ms_user_type', data.type);
                        localStorage.setItem('ms_username', data.username);
                        localStorage.setItem('ms_user_status', data.status);
                        localStorage.setItem('ms_user_detail', data.detail);
                        localStorage.setItem('ms_user_email', data.email);
                        localStorage.setItem('ms_user_image', data.image);
                        localStorage.setItem('ms_user_last_local', data.last_local);
                        localStorage.setItem('ms_user_last_login_time', data.last_login_time);

                        let accessToken = res.access_token;
                        localStorage.setItem('accessToken', accessToken); // 用localStorage缓存token值
                        if (data.type === 'admin') {
                            this.$router.push('/admin');
                        } else {
                            this.$router.push('/user');
                        }
                    } else {
                        this.$message.error('登录失败:' + msg);
                    }
                })
                .catch((error) => {
                    this.$message.error('登录失败!');
                });
        },
        //注册
        register() {
            this.$router.push('/register');
        }
    }
};
</script>

<style scoped lang="less">
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background: #fff;
}

.login-main {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-image: url('../../../assets/img/Login/bg.jpg');
    background-size: 100% 100%;
    background-repeat: no-repeat;

    .main-panel {
        background: #ffffff8f;
        border-radius: 20px;
        display: flex;
    }

    .panel-left {
        flex: 1;

        .left-image {
            padding: 40px;
        }
    }

    .panel-right {
        flex: 1;
        padding: 40px 80px 40px 40px;

        .panel-head {
            display: flex;
            align-items: center;
            margin-bottom: 40px;

            .head-line-left {
                background: linear-gradient(to right, #fff, #4695ff);
                height: 1px;
                flex: 1;
            }

            .head-line-right {
                background: linear-gradient(to right, #4695ff, #fff);
                height: 1px;
                flex: 1;
            }

            .head-title {
                color: #4695ff;
                font-weight: bold;
                font-size: 24px;
            }
        }

        .panel-title {
            text-align: center;
            font-size: 24px;
            line-height: 40px;
            height: 40px;
            margin-bottom: 20px;
        }
    }
}

.login-btn {
    background: #409eff;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    color: #fff;
    margin-bottom: 10px;
    cursor: pointer;
}

.register-btn {
    background: #fff;
    text-align: center;
    line-height: 40px;
    border-radius: 20px;
    color: #409eff;
    box-sizing: border-box;
    border: 1px solid #eeeeee;
    cursor: pointer;
}

.tip {
    color: #797979;
    margin-top: -14px;
    font-size: 12px;
    margin-bottom: 20px;
}

.inputLength {
    width: 300px;
}
</style>
