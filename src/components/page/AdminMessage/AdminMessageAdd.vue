<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 消息管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>发布消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="form-box" style="width: 90%;">
                <el-form ref="form" :model="messageForm" :rules="formRules" label-width="80px">
                    <el-form-item label="接收用户"  prop="receive_user">
                        <el-radio-group v-model="messageForm.receive_user">
                            <el-radio label="1" value="1">全部用户</el-radio>
                            <el-radio label="2" value="2">指定用户</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <div v-if="messageForm.receive_user == 2">
                        <el-form-item label="用户id" style="width: 25%;" prop="receive_user_id">
                            <el-input v-model="messageForm.receive_user_id"></el-input>
                        </el-form-item>
                    </div>

                    <el-form-item label="消息标题" prop="title">
                        <el-input v-model="messageForm.title"></el-input>
                    </el-form-item>


                    <el-form-item label="紧急程度" prop="priority">
                        <el-radio-group v-model="messageForm.priority">
                            <el-radio label="1" value="1">
                                <el-tag type="normal">普通消息</el-tag>
                            </el-radio>
                            <el-radio label="3" value="3">
                                <el-tag type="warning">较为紧急</el-tag>
                            </el-radio>
                            <el-radio label="5" value="5">
                                <el-tag type="danger">非常紧急</el-tag>
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="消息内容" prop="content">
                        <quill-editor v-model="messageForm.content"></quill-editor>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">发布消息</el-button>
                        <el-button>取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { adminAddMessage } from '@/api/Massage.js';
    import { quillEditor } from 'vue-quill-editor';
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'messageForm',
        components: {
            quillEditor
        },
        data() {
            let validateTitleName = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 64) {
                    callback(new Error('消息名不能超过64个字符'));
                } else{
                    callback();
                }
            }
            let validateTitleNotEmoji = (rule,value,callback)=>{
                let hasEmoji = emojiRegex.test(value) // true
                if (hasEmoji) {
                    callback(new Error('消息名中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            return {
                admin_id: localStorage.getItem('ms_user_id'),
                messageForm: {
                    receive_user: '1',
                    receive_user_id: '',
                    title: '',
                    priority: '1',
                    content: ''
                },
                formRules:{
                    title:[ { required: true, message: '请输入消息名', trigger: 'blur' },
                        { validator: validateTitleName, trigger: 'blur' },
                        { validator: validateTitleNotEmoji, trigger: 'blur' }],
                    content:[
                        { required: true, message: '请输入消息内容', trigger: 'blur' }
                    ]
                }
            };
        },
        watch:{
            //修改消息内容富文本框
            'messageForm.content':function(newVal, oldVal) {
                this.$nextTick(()=>{
                    this.$refs['form'].validateField('content');
                })
            }
        },
        methods: {
            //发送消息
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let params = {
                            admin_id: this.admin_id,
                            receive_user_type: this.messageForm.receive_user,
                            receive_user_id: this.messageForm.receive_user_id,
                            title: this.messageForm.title,
                            priority: this.messageForm.priority,
                            content: this.messageForm.content
                        };
                        adminAddMessage(params).then(res => {
                            let { data, status, msg } = res;
                            if (status == 200) {
                                this.$message.success('消息发布成功！');
                            } else {
                                this.$message.error(`消息发布失败:${msg}！`);
                            }
                        }).catch(error => {
                            this.$message.error('消息发布失败!');
                        });
                    }else {
                        return false;
                    }
                })
            },

        }
    };
</script>