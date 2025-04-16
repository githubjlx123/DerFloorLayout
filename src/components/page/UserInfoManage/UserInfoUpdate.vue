<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 信息管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>修改个人信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="formRules" :model="userEditForm" label-width="80px">

                    <el-form-item label="用户id" prop="user_id">
                        <el-input v-model="userEditForm.user_id" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="用户邮箱" prop="email">
                        <el-input v-model="userEditForm.email" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userEditForm.username"></el-input>
                    </el-form-item>

                    <el-form-item label="联系方式" prop="phone">
                        <el-input v-model="userEditForm.phone"></el-input>
                    </el-form-item>

                    <el-form-item label="用户简介" prop="detail">
                        <el-input type="textarea" rows="5" v-model="userEditForm.detail"></el-input>
                    </el-form-item>

                    <el-form-item label="用户头像">
                        <el-upload
                                class="avatar-uploader"
                                action="#"
                                :auto-upload="false"
                                :show-file-list="false"
                                :on-change="onImageChange"
                        >
                            <img v-if="userEditForm.image" :src="userEditForm.image" class="avatar">
                            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                    </el-form-item>
                    
                    <el-form-item label="用户状态">
                        <el-radio-group v-model="userEditForm.status">
                            <el-radio :label="0" value="0" :disabled="true">正常</el-radio>
                            <el-radio :label="1" value="1" :disabled="true">锁定</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即修改</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {getUserById,editUserInfo} from '@/api/UserManage.js'
    import EventBus from '@utils/bus.js'
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'userEditForm',
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
            }
            return {
                user_id: localStorage.getItem('ms_user_id'),
                userEditForm: {
                    user_id: localStorage.getItem('ms_user_id'),
                    email: localStorage.getItem('ms_user_email'),
                    username: '',
                    detail: '',
                    status: 0,
                    image: '',
                    file_name:'',
                    file:'',
                    phone:''
                },//用户信息表单
                formRules:{
                    username:[ { required: true, message: '请输入用户名', trigger: 'change' },
                        { validator: validateUserName, trigger: 'change' },
                    ],
                    detail:[
                        { validator: validateDetail, trigger: 'change' },
                    ],
                    phone:[ { required: true, message: '请输入联系方式', trigger: 'blur' },
                    { pattern: /^((0\d{2,3}-\d{7,8})|(1[34578]\d{9}))$/,required: true, message: "联系方式格式有误", trigger: "blur" }
                    ],
                },//表单校验
            };
        },
        created() {
            this.getData();
        },
        methods: {
            getData() {
                let params = {
                    user_id:this.user_id
                }
                getUserById(params).then(res =>{
                    let {data,status} = res;
                    if (status == '200') {
                        for(let key in data){
                            if(key == 'id'){
                                this.userEditForm.user_id = data.id;
                            }else if(key == 'image'){
                                this.userEditForm[key] = `${this.$serverUrl}${data[key]}?${new Date().getTime()}`;
                            }else {
                                this.userEditForm[key]= data[key];
                            }
                        }

                    } else {
                        this.$message.error('获取用户信息失败！');
                    }
                }).catch(error =>{
                    this.$message.error('获取用户信息失败！');
                })
            },
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let formData = new FormData();
                        formData.append('user_id', this.userEditForm.user_id);
                        formData.append('username', this.userEditForm.username);
                        formData.append('email', this.userEditForm.email);
                        formData.append('detail', this.userEditForm.detail);
                        formData.append('status', this.userEditForm.status);
                        formData.append('level', this.userEditForm.level);
                        formData.append('phone', this.userEditForm.phone);
                        formData.append('file', this.userEditForm.file);
                        formData.append('file_name', this.userEditForm.file_name);
                        /* 提交后台服务器 */
                        editUserInfo(formData).then(res =>{
                            let {data,status,msg} = res;
                            if (status == '200') {
                                this.$message.success('成功修改id为' + this.userEditForm.user_id.toString() + '的用户信息');
                                localStorage.setItem('ms_username',  this.userEditForm.username);
                                localStorage.setItem('ms_user_image',  `static/user/image/${this.userEditForm.user_id}.jpg`);
                                EventBus.$emit('update')
                            } else {
                                this.$message.error('修改失败！'+msg);
                            }
                        }).catch(error =>{
                            this.$message.error('修改失败！');
                        })
                    } else {
                        return false;
                    }
                });
                /* 通过formData获取数据 */

            },
            onImageChange(file){
                const isJPG =
                    file.raw.type === 'image/jpeg' ||
                    file.raw.type === 'image/jpg' ||
                    file.raw.type === 'image/png'
                if (!isJPG) {
                    this.$message.error('上传头像图片只能是 JPG/JPEG/PNG 格式!');
                }else {
                    this.userEditForm.image = URL.createObjectURL(file.raw);
                    this.userEditForm.file = file.raw;
                    this.userEditForm.file_name = file.name;
                }

            }
        }
    };
</script>
<style lang="less" scoped>
    .avatar-uploader {
        width: 180px;
        height: 180px;
    }

    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 150px;
        height: 150px;
    }

    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 148px;
        height: 148px;
        line-height: 148px;
        text-align: center;
    }

    .avatar {
        width: 148px;
        height: 148px;
        display: block;
    }
</style>
