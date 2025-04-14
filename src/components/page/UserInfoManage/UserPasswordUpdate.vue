<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 信息管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>修改密码</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="formRules" :model="userEditForm" label-width="80px">
					
					<el-form-item label="用户id">
					    <el-input v-model="userEditForm.id" :disabled="true"></el-input>
					</el-form-item>
                    
                    <el-form-item label="旧密码" prop="old_password">
                    	<el-input v-model="userEditForm.old_password" class="no-autofill-pwd"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="新密码" prop="password">
                    	<el-input v-model="userEditForm.password" class="no-autofill-pwd"></el-input>
                    </el-form-item>
					
					<el-form-item label="确认密码" prop="confirm_password">
						<el-input v-model="userEditForm.confirm_password" class="no-autofill-pwd"></el-input>
					</el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">立即修改</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {resetPwd} from '@/api/UserManage.js'
import md5 from 'js-md5'

export default {
    name: 'userPasswordUpload',
    data() {
        return {
            userEditForm: {
				id: localStorage.getItem('ms_user_id'),
                old_password: '',
                password: '',
                confirm_password: '',
            },
            formRules:{
                old_password:[ { required: true, message: '请输入原始密码', trigger: 'blur' },],
                password:[ { required: true, message: '请输入新密码', trigger: 'blur' },
                    { min: 8, max: 15, message: '密码长度应大于等于8个字符小于16个字符', trigger: "blur" },
                    { pattern: /(?![A-Z]*$)(?![a-z]*$)(?![0-9]*$)(?![^a-zA-Z0-9]*$)/,required: true, message: "密码必须由大写字母、小写字母、数字、特殊符号中的2种及以上类型组成", trigger: "blur" }
                ],
                confirm_password:[ { required: true, message: '请确认密码', trigger: 'blur' },],
            }
        };
    },
	
    methods: {
        onSubmit() {
            this.$refs['form'].validate((valid) => {
                if (valid) {
                    if(this.userEditForm.password != this.userEditForm.confirm_password){
                        this.$message.error('两次输入的密码不一致！！')
                        return
                    }else {
                        let params = {
                            user_id:this.userEditForm.id,
                            old_password:md5('deepOnce'+this.userEditForm.old_password),
                            new_password:md5('deepOnce'+this.userEditForm.password),
                            confirm_password:md5('deepOnce'+this.userEditForm.confirm_password),
                        }
                        resetPwd(params).then(res =>{
                            let {status,msg} = res;
                            if(status == '200'){
                                this.$message.success('密码修改成功，请重新登录！');
                                localStorage.removeItem('ms_user_id');
                                this.$router.push('/login');
                            } else{
                                this.$message.error('修改失败:' +msg+'!')
                            }
                        }).catch(error =>{
                            this.$message.error('修改失败!' )
                        })
                    }
                } else {
                    return false;
                }
            });
        },
        onReset(){
            this.userEditForm.password = '';
            this.userEditForm.confirm_password = '';
            this.$refs['form'].clearValidate();
        }
    }
};
</script>
<style scoped lang="less">
    .no-autofill-pwd {
        /deep/ .el-input__inner {
            -webkit-text-security: disc !important;
        }
    }

</style>
