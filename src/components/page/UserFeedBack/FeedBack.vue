<template>
    <div class="feed-back">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 意见反馈
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="feed-back-container">
            <p class="tip">
                (Tip:很高兴您能对该系统提出宝贵的建议，若您的建议被采纳，我们将会给予您一定的奖励，感谢您的建议。)
            </p>
            <el-form ref="FeedBackForm" :model="feedBackForm" :rules="feedBackRules" label-width="80px">
                <el-form-item label="标题" prop="title">
                    <el-input v-model="feedBackForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="反馈内容" prop="content">
                    <quill-editor v-model="feedBackForm.content"></quill-editor>
                </el-form-item>
                <el-form-item >
                    <el-button type="primary" @click="onsubmit">提交</el-button>
                    <el-button type="" @click="onReset">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {sendMessageToAdmin} from '@/api/Massage.js'
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'FeedBack',
        components: {
            quillEditor
        },
        data() {
            let validateTitle = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 64) {
                    callback(new Error('标题不能超过64个字符'));
                } else{
                    callback();
                }
            }
            let validateTitleNotEmoji = (rule,value,callback)=>{
                let hasEmoji = emojiRegex.test(value) // true
                if (hasEmoji) {
                    callback(new Error('标题中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            return {
                user_id: localStorage.getItem('ms_user_id'),
                feedBackForm: {
                    title: '',
                    content: ''
                },
                feedBackRules: {
                    title:[
                        { required: true, message: '请输入标题', trigger: 'blur' },
                        { validator: validateTitle, trigger: 'change' },
                        { validator: validateTitleNotEmoji, trigger: 'blur' },
                    ]
                }
            };
        },
        methods:{
            onsubmit(){
                let params = {};
                for (let ele in this.feedBackForm) {
                    params[ele] =this.feedBackForm[ele];
                }
                params.user_id = this.user_id;
                sendMessageToAdmin(params).then(res =>{
                    let {status,data,msg} = res;
                    if(status ==200){
                        this.$message.success('意见提交成功!');
                        this.$router.push({name:'userMessageList',params:{pane:'four'}})
                    }else {
                        this.$message.error(`意见提交失败${msg}`);
                    }
                })

            },
            onReset(){
                for (let ele in this.feedBackForm) {
                    this.feedBackForm[ele] = '';
                }
            }
        }
    };
</script>

<style scoped lang="less">
    .tip{
        color: #999999;
        margin: 10px;
    }

    .feed-back-container {
        padding: 10px 20px;
    }

</style>