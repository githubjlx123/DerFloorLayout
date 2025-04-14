<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 用户
                </el-breadcrumb-item>
                <el-breadcrumb-item>添加用户</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="userForm" :rules="formRules" label-width="80px">
                    <el-form-item label="用户名称" prop="name">
                        <el-input v-model="userForm.name" placeholder="请输入用户名"></el-input>
                    </el-form-item>

                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userForm.email" placeholder="请输入用户邮箱"></el-input>
                    </el-form-item>

                    <el-form-item label="用户密码" prop="password">
                        <el-input v-model="userForm.password" placeholder="请输入初始密码"></el-input>
                    </el-form-item>

                    <el-form-item label="用户状态" prop="status">
                        <el-radio-group v-model="userForm.status">
                            <el-radio label="0" value="0">正常</el-radio>
                            <el-radio label="1" value="1">冻结</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="用户类型" prop="level">
                        <el-radio-group v-model="userForm.level">
                            <el-radio label="0" value="0">普通用户</el-radio>
                            <el-radio label="1" value="1">高级用户</el-radio>
                            <el-radio label="2" value="2">测试用户</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="联系电话" prop="phone" >
                        <el-input v-model="userForm.phone" placeholder="请输入用户联系电话"></el-input>
                    </el-form-item>

                    <el-form-item label="用户备注" prop="detail">
                        <el-input type="textarea" rows="5" v-model="userForm.detail" placeholder="备注"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">添加用户</el-button>
                        <el-button @click="initForm">清空</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { adminAddUser ,checkEmail} from '@/api/UserManage.js';
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'userForm',
        data() {
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
                userForm: {
                    name: '',
                    email: '',
                    password: '',
                    status: '0',
                    level: '0',
                    phone: '',
                    detail: ''
                },//用户信息表单
                formRules:{
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
                    password: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
                    phone: [
                        { validator: validatePhone, trigger: 'blur' }

                    ],
                    detail: [
                        { validator: validateDetail, trigger: 'change' },
                    ],

                }
            };
        },
        methods: {
            //添加用户
            onSubmit() {
                this.$refs['form'].validate((valid)=>{
                    if(valid){
                        let params = {};
                        for (let key in this.userForm) {
                            params[key] = this.userForm[key];
                        }
						
						params["password"] = md5('deepOnce'+this.userForm.password);
						
                        adminAddUser(params).then(res => {
                            let {status,msg} = res;
                            if(status == 200){
                                this.$message.success('用户添加成功!');
                                this.initForm();
                            }else {
                                this.$message.error('用户添加失败：'+msg+'！');
                            }
                        }).catch(error => {
                            this.$message.error('添加失败!');
                        });
                    }else {
                        return false;
                    }
                })

            },
            //清空表单
            initForm() {
                for (let key in this.userForm) {
                    if(key == 'status' || key == 'level'){
                        this.userForm[key] = '0';
                    }else {
                        this.userForm[key] = '';
                    }
                }
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate();
                })
            }
        }
    };
</script>