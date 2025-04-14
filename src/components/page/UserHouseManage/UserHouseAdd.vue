<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 户型管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>创建户型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :model="houseForm" :rules="rules" label-width="80px">
                    <el-form-item label="用户id" prop="user_id">
                        <el-input v-model="houseForm.user_id" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="所属项目" prop="project_id">
                        <el-select v-model="houseForm.project_id" placeholder="请选择">
                            <div v-for="(project,index) in userProjects" :key="index">
                                <el-option :key="index"
                                           :label="project.name + '（id: ' + project.id + '）'"
                                           :value="project.id">
                                </el-option>
                            </div>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="户型名称" prop="name">
                        <el-input v-model="houseForm.name" placeholder="请输入户型名称"></el-input>
                    </el-form-item>

                    <el-form-item label="户型描述" prop="detail">
                        <el-input type="textarea" placeholder="请输入户型描述" rows="5"
                                  v-model="houseForm.detail"></el-input>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">创建户型</el-button>
                        <el-button @click="handleClear">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {createHouse} from '@/api/HouseManage.js';
    import {getProjectByUserIdForList} from '@/api/ProjectManage.js'
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'houseForm',
        data() {
            let validateHouseName = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 64) {
                    callback(new Error('户型名不能超过64个字符'));
                } else{
                    callback();
                }
            }
            let validateNameNotEmoji = (rule,value,callback)=>{
                let hasEmoji = emojiRegex.test(value) // true
                if (hasEmoji) {
                    callback(new Error('户型名中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            let validateHouseDetail = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 400) {
                    callback(new Error('户型名不能超过400个字符'));
                } else{
                    callback();
                }
            }
            return {
                houseForm: {
                    user_id: localStorage.getItem('ms_user_id'),
                    project_id: '',
                    name: '',
                    detail: ''
                },//表单项
                rules: {
                    name: [{ required: true, message: '请输入户型名称', trigger: 'blur' },
                        { validator: validateHouseName, trigger: 'blur' },
                        { validator: validateNameNotEmoji, trigger: 'blur' },
                    ],
                    project_id: [{ required: true, message: '请选择所属项目', trigger: 'change' }],
                    detail:[
                        { validator: validateHouseDetail, trigger: 'change' },
                    ]
                },//表单规则
                userProjects: [],//项目下拉框
            };
        },
        created() {
            this.getProjectsData()
        },
        mounted(){
            let params = this.$route.params;
            if(params.project_id){
                this.houseForm.project_id = parseInt(params.project_id);
            }
        },
        methods: {
            //查询项目下拉框
            getProjectsData() {
                let params = {
                    user_id: this.houseForm.user_id
                };
                getProjectByUserIdForList(params).then(res => {
                    let { data, status ,msg} = res;
                    if (status == 200) {
                        this.userProjects = data;
                    } else {
                        this.userProjects = [];
                        this.$message.error('获取数据失败:'+msg);
                    }
                }).catch(error => {
                    this.userProjects = [];
                    this.$message.error('获取数据失败!');
                });
            },
            //提交表单
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let params = {};
                        for (let key in this.houseForm) {
                            params[key] = this.houseForm[key];
                        }
                        createHouse(params).then(res => {
                            let { status, msg } = res;
                            if (status == '200') {
                                this.$message.success('户型创建成功!');
                                this.$confirm('是否跳转至户型页面?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push('/houseListPage')
                                }).catch(() => {
                                });
                            } else {
                                this.$message.error('创建失败!' + msg);
                            }
                        }).catch(error => {
                            this.$message.error('创建失败!');
                        });
                    } else {
                        return false;
                    }
                });
            },
            //清空表单
            handleClear() {
                for (let key in this.houseForm) {
                    if (key != 'user_id') {
                        this.houseForm[key] = '';
                    }
                }
                this.$nextTick(()=>{
                    this.$refs['form'].clearValidate();
                    })
            }
        }
    };
</script>