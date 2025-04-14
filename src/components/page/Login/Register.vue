<template>
    <div class="login-wrap">
        <div class="login-main">
            <div class="main-panel">
                <div class="panel-right">
                    <div class="panel-head">
                        <div class="head-line-left"></div>
                        <div class="head-title">DeepLay-AI 智能铺装注册</div>
                        <div class="head-line-right"></div>
                    </div>
                    <el-form :model="registerForm" :rules="registerFormRules" ref="registerForm" label-width="80px">
                        <el-form-item prop="email" label="用户邮箱">
                            <el-input v-model="registerForm.email" placeholder="邮箱" class="inputLength">
                                <i slot="prefix" class="el-icon-s-promotion"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="name" label="用户名称">
                            <el-input v-model="registerForm.name" placeholder="用户名称" class="inputLength">
                                <i slot="prefix" class="el-icon-user"></i>
                            </el-input>
                        </el-form-item>

                        <el-form-item prop="phone" label="联系方式">
                            <el-input v-model="registerForm.phone" placeholder="联系方式" class="inputLength">
                                <i slot="prefix" class="el-icon-phone-outline"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="detail" label="用户备注">
                            <el-input v-model="registerForm.detail" placeholder="用户备注" class="inputLength">
                                <i slot="prefix" class="el-icon-edit-outline"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="password" label="用户密码">
                            <el-input placeholder="密码" v-model="registerForm.password"
                                      class="inputLength no-autofill-pwd">
                                <i slot="prefix" class="el-icon-key"></i>
                            </el-input>
                        </el-form-item>
                        <el-form-item prop="confirm_password" label="确认密码">
                            <el-input placeholder="确认密码" v-model="registerForm.confirm_password"
                                      class="inputLength no-autofill-pwd">
                                <i slot="prefix" class="el-icon-key"></i>
                            </el-input>
                        </el-form-item>
                        <div class="login-btn" @click="submitForm()">注册</div>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {checkEmail } from '@/api/UserManage.js';
    import { registerUser } from '@/api/Login.js';
    import {byteLength,emojiRegex} from '@utils/common.js';
    import md5 from 'js-md5';

    export default {
        data: function() {
            //校验用户名
            let validateUserName = (rule,value,callback)=>{
                let strlength = byteLength(value);
                let hasEmoji = emojiRegex.test(value) // true
                if (strlength > 64) {
                    callback(new Error('用户名不能超过64个字符'));
                } else if(hasEmoji){
                    callback(new Error('用户名中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            //校验Email
            let validateEmail = (rule, value, callback) => {
                let params = {
                    email: value
                };
                checkEmail(params).then(res => {
                    let { status } = res;
                    if (status == 200) {
                        callback();
                    } else {
                        callback('此邮箱已被注册');
                    }
                }).catch(error => {
                    callback('未能检测邮箱');
                    this.$message.error('检测邮箱失效!');
                });
            };
            //校验电话
            let validatePhone = (rule, value, callback) => {
                if (value) {
                    const regPhone = /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/;
                    if (regPhone.test(value)) {
                        callback();
                    } else {
                        callback('联系方式格式有误');
                    }
                } else {
                    callback();
                }
            };
            //校验密码
            let validatePassword = (rule, value, callback) => {
                if (value && value != this.registerForm.password) {
                    callback('两次密码不一致');
                } else {
                    callback();
                }
            };
            //校验用户备注
            let validateDetail = (rule,value,callback)=>{
                let strlength = byteLength(value);
                let hasEmoji = emojiRegex.test(value) // true
                if (strlength > 200) {
                    callback(new Error('用户简介不能超过200个字符'));
                } else if(hasEmoji){
                    callback(new Error('用户简介中不能含有特殊符号'));
                } else{
                    callback();
                }
            };
            return {
                registerForm: {
                    name: '',
                    email: '',
                    phone: '',
                    detail: '',
                    password: '',
                    confirm_password: ''
                },//注册表单
                registerFormRules: {
                    name: [
                        { required: true, message: '用户名不能为空', trigger: 'change' },
                        { validator: validateUserName, trigger: 'change' },
                    ],
                    email: [{ required: true, message: '邮箱不能为空', trigger: 'blur' },
                        {
                            required: true,
                            message: '请输入合法邮箱',
                            trigger: 'blur',
                            pattern: /^\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/
                        },
                        { validator: validateEmail, trigger: 'blur' }
                    ],
                    phone: [
                        { validator: validatePhone, trigger: 'blur' }
                    ],
                    detail: [ { validator: validateDetail, trigger: 'change' },],
                    password: [{ required: true, message: '密码不能为空', trigger: 'blur' },
                        {
                            pattern: /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/,
                            required: true,
                            message: '须由大/小写字母、数字、特殊符号中的2种及以上组成',
                            trigger: 'blur'
                        }
                    ],
                    confirm_password: [{ required: true, message: '确认密码不能为空', trigger: 'blur' },
                        { validator: validatePassword, trigger: 'blur' }
                    ]
                },//注册规则
                okEmail: false,//检验Email
            };
        },
        methods: {
            //提交表单
            submitForm() {
                this.$refs['registerForm'].validate((valid) => {
                    if (valid) {
                        let params = {
                            name: this.registerForm.name,
                            email: this.registerForm.email,
                            phone: this.registerForm.phone,
                            detail: this.registerForm.detail,
                            password: md5('DeepLay'+this.registerForm.password),
                            status : '0',
                            level : '0',
                        };
                        registerUser(params).then(res => {
                            let { status, msg } = res;
                            if (status == '200') {
                                this.$message.success('注册成功!');
                                this.$router.push('/login');
                            } else {
                                this.$message.error('注册失败:' + msg);
                            }
                        }).catch(error => {
                            this.$message.error('注册失败!');
                        });
                    } else {
                        return false;
                    }
                });
            },
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

    .login-head {
        height: 80px;
        background-color: #ffffff;
        width: 100%;
    }

    .login-main {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-image: url("../../../assets/img/Login/bg.jpg");
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
            padding: 60px;

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

    .no-autofill-pwd {
        /deep/ .el-input__inner {
            -webkit-text-security: disc !important;
        }
    }
</style>
