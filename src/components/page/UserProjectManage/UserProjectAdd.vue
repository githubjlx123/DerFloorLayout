<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 项目管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>创建项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box">
                <el-form ref="form" :rules="projectRules" :model="projectForm" label-width="80px">
                    <el-input type="hidden" v-model="projectForm.user_id" :disabled="true"></el-input>
                    <el-form-item label="项目名称" prop="name">
                        <el-input v-model="projectForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="项目类型" prop="mission">
                        <el-radio-group v-model="projectForm.mission" @change="handleMission">
                            <el-radio :label="1" value="1">常规铺装</el-radio>
                           <el-radio :label="2" value="2" :disabled="true">扩展任务</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="项目描述" prop="detail">
                        <el-input type="textarea" rows="5" v-model="projectForm.detail" aria-placeholder="该项目描述信息"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">创建项目</el-button>
                        <el-button @click="onReset">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
           <div class="line"></div>
            <div class="info">
                <div class="info-title">{{info.title}}</div>
                <div class="info-contain">
                    <div class="info-image">
                        <img :src="info.image"/>
                    </div>
                    <div class="info-content">
                        <div class="info-content">{{info.detail}}</div>
                        <div class="info-content">{{info.detail2}}</div>
                    </div>
                </div>

            

            <div v-if="projectForm.mission === 1">
                <div class="info-title">示例结果</div>

                <div class="info-content">
                    <div class="info-contain">
                        <div class="info-content">
                            <ul>户型A：三室，面积120㎡，损耗率3.17%。</ul>
                            <ul>户型B：两室，面积80㎡，损耗率2.5%。</ul>
                            <ul>户型C：两室，面积80㎡，损耗率1.8%。</ul>
                        </div>
                    </div> 
                </div>
            </div>
            <div v-if="projectForm.mission === 2">
                <div class="info-title">示例结果</div>
                
                <div class="info-content">
                    <div class="info-contain">
                        <div class="info-content">
                            <ul>测试项目：面积12,118㎡，整体损耗率2.17%。</ul>
                        </div>
                    </div> 
                </div>
            </div>

            
</div>
                
            </div>
        </div>
    </div>
</template>

<script>
    import { createProject } from '@/api/ProjectManage.js';
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'projectForm',
        data() {
            let validateProjectName = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 64) {
                    callback(new Error('项目名不能超过64个字符'));
                } else{
                    callback();
                }
            }
            let validateNameNotEmoji = (rule,value,callback)=>{
                let hasEmoji = emojiRegex.test(value) // true
                if (hasEmoji) {
                    callback(new Error('项目名中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            let validateProjectDetail = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 400) {
                    callback(new Error('项目名不能超过400个字符'));
                } else{
                    callback();
                }
            }
            return {
                projectForm: {
                    user_id: localStorage.getItem('ms_user_id'),
                    name: '',
                    mission: 1,
                    detail: ''
                },//项目表单
                projectRules:{
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { validator: validateProjectName, trigger: 'blur' },
                        { validator: validateNameNotEmoji, trigger: 'blur' },
                    ],
                    detail:[
                        { validator: validateProjectDetail, trigger: 'change' },
                    ]
                },//校验规则
                info: {
                    title: '',
                    image: '',
                    detail: ''
                },//类别信息
                infoList: [
                    {
                        title: '常规铺装',
                        image: require('@assets/img/Project/regular.png'), // 示例图片路径
                        detail: '常规铺装模式适用于每个户型独立计算损耗率的场景。在该模式下，系统会为项目中的每个户型单独生成铺装方案，并计算其对应的地板利用率、材料损耗等数据。',
                        detail2: '用户可以清晰地了解每个户型的铺装效果和材料消耗情况，便于针对性地优化铺装方案。常规铺装模式的优势在于灵活性强，能够满足多样化的铺装需求，尤其适合需要精细化管理的工程项目。'
                    },
                    {
                        title: '整体铺装',
                        image: require('@assets/img/Project/overall.png'), // 示例图片路径
                        detail: '整体铺装模式将项目下所有户型作为一个整体进行铺装计算。在该模式下，系统会综合考虑所有户型的铺装需求，将剩余地板从一个户型带到下一个户型使用，从而优化材料利用率，减少浪费。',
                        detail2: '这种模式适合户型相似且需要最大化节约材料的项目，例如批量生产的住宅或商业空间。整体铺装模式的优势在于能够显著降低材料损耗率，提升整体铺装效率，尤其适合大规模、标准化程度较高的工程项目。'
                    
                    }
                ],//类别信息列表
            };
        },
        created() {
            this.handleMission(1);
        },
        methods: {
            //创建项目
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let params = {
                            user_id: this.projectForm.user_id,
                            name: this.projectForm.name,
                            detail: this.projectForm.detail,
                            mission: this.projectForm.mission
                        };
                        createProject(params).then(res => {
                            let { status, msg } = res;
                            if (status == '200') {
                                this.$message.success('创建项目成功！');
                                this.$confirm('是否跳转至项目列表页面?', '提示', {
                                    confirmButtonText: '确定',
                                    cancelButtonText: '取消',
                                    type: 'warning'
                                }).then(() => {
                                    this.$router.push('/projectListPage')
                                }).catch(() => {
                                });
                            } else {
                                this.$message.error('创建失败:' + msg);
                            }
                        }).catch(error => {
                            this.$message.error('创建失败！');
                        });
                    } else {
                        return false;
                    }
                });

            },
            //重置表单
            onReset(){
                for(let key in this.projectForm){
                    if(key == 'user_id'){}else if(key == 'mission'){
                        this.projectForm[key] = 1;
                    }else {
                        this.projectForm[key] = '';
                    }
                }
                this.handleMission(1);
                this.$refs['form'].clearValidate();
            },
            //初始化项目类别
            handleMission(mission) {
                this.info = this.infoList.find(item => item.title === {
                    1: '常规铺装',
                    2: '整体铺装'
                }[mission]);
            }
        }
    };
</script>
<style scoped lang="less">
    .container {
        display: flex;
    }

    .form-box {
        flex: 1;
    }

    .info {
        flex: 1;

        .info-title {
            font-size: 20px;
            font-weight: bold;
            padding: 10px;
        }

        .info-contain {
            display: flex;
            padding: 10px;

            .info-image {
                flex: 1;
                margin-right: 20px;
                img {
                    width: 100%;
                    height: 100%;
                }
            }

            .info-content {
                flex: 2;
                line-height: 1.7;
                text-indent: 2em;
            }
        }
    }

    .line {
        border-right: 1px dashed #333;
        margin: 0 20px;
    }
</style>
