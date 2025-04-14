<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-copy"></i> 消息中心</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="message_type">
                <el-tab-pane :label="`未读消息(${unread.length})`" name="first">
                    <el-table :data="unread" :show-header="false" style="width: 100%">
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="showMessageDetail(scope.$index, scope.row)">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>

                        <el-table-column prop="priority" width="120">
                            <div slot-scope="scope" v-if="scope.row.priority == 1">
                                <el-tag type="normal">普通消息</el-tag>
                            </div>
                            <div slot-scope="scope" v-else-if="scope.row.priority == 3">
                                <el-tag type="warning">较为紧急</el-tag>
                            </div>
                            <div slot-scope="scope" v-else-if="scope.row.priority == 5">
                                <el-tag type="danger">非常紧急</el-tag>
                            </div>
                        </el-table-column>

                        <el-table-column prop="publish_time" width="180"></el-table-column>
                        <!-- <el-table-column width="120">
                             <template slot-scope="scope">
                                 <el-button size="small" @click="handleRead(scope.$index, scope.row)">标为已读</el-button>
                             </template>
                         </el-table-column>-->
                    </el-table>
                    <div class="handle-row">
                        <el-button type="primary" @click="handleReadAll()">全部标为已读</el-button>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message_type === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title" @click="showMessageDetail(scope.$index, scope.row)">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="publish_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleDelAll()">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message_type === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="publish_time" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index, scope.row)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger" @click="handleDestoryAll()">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`已发送(${send.length})`" name="four">
                    <el-table :data="send" :show-header="false" style="width: 100%">
                        <el-table-column type="index" width="50"></el-table-column>
                        <el-table-column>
                            <template slot-scope="scope">
                                <span class="message-title" @click="showSendMessageDetail(scope.$index, scope.row)">{{scope.row.title}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="publish_time" width="180"></el-table-column>
                        <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button type="primary" @click="showSendMessageDetail(scope.$index, scope.row)">查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 详细结果 -->
        <el-dialog title="公告消息" :visible.sync="messageVisible" width="80%">
            <el-form ref="form" :model="messageForm" label-width="80px">

                <el-form-item label="消息标题">
                    <el-input v-model="messageForm.title"></el-input>
                </el-form-item>

                <el-form-item label="紧急程度">
                    <el-radio-group v-model="messageForm.priority">
                        <el-radio label="1" value="1" :disabled="true">
                            <el-tag type="normal">普通消息</el-tag>
                        </el-radio>
                        <el-radio label="3" value="3" :disabled="true">
                            <el-tag type="warning">较为紧急</el-tag>
                        </el-radio>
                        <el-radio label="5" value="5" :disabled="true">
                            <el-tag type="danger">非常紧急</el-tag>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="消息内容">
                    <!-- <el-input type="textarea" rows="5" v-model="messageForm.content"></el-input> -->
                    <quill-editor v-model="messageForm.content" :options="editorOption"
                                  style="padding: 0 15px;border: 1px solid #DCDFE6;background-color: rgba(255, 255, 255, 0.247);border-radius: 4px;"></quill-editor>
                    <!-- <div v-html="messageForm.content" style="padding: 0 15px;border: 1px solid #DCDFE6;background-color: rgba(255, 255, 255, 0.247);border-radius: 4px;"></div>	 -->

                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
				<el-button @click="messageVisible = false">取 消</el-button>
				<el-button type="primary" @click="handleClose ">确 定</el-button>
			</span>
        </el-dialog>
        <el-dialog title="已发送" :visible.sync="sendMessageVisible" width="80%">
            <el-form ref="form" :model="sendForm" label-width="80px">
                <el-form-item label="消息标题">
                    <el-input v-model="sendForm.title"></el-input>
                </el-form-item>

                <el-form-item label="消息内容">
                    <quill-editor v-model="sendForm.content" :options="editorOption"
                                  class="me-quill-editor"></quill-editor>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
				<el-button @click="sendMessageVisible = false">取 消</el-button>
				<el-button type="primary" @click="sendMessageVisible = false">确 定</el-button>
			</span>
        </el-dialog>
    </div>
</template>

<script>
    import axios from 'axios';
    import EventBus from '@utils/bus.js';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {
        getUserSendMessageById,
        getMessageByUserId,
        updateMessageStatus,
        updateMessageNormalToRecycleByList,
        updateMessageRecycleToNormalByList,
        updateMessageDestroyByList
    } from '@/api/Massage.js';

    export default {
        name: 'userMessageList',
        components: {
            quillEditor
        },
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                message_type: 'first',//pane序号
                unread: [],//未读列表
                read: [],//已读列表
                recycle: [],//回收站
                messageVisible: false,//消息显示
                messageForm: {
                    receive_user: '1',
                    receive_user_id: '',
                    title: '',
                    priority: '1',
                    content: '',
                    receive_number: '0',
                    read_number: '1'

                },//信息内容
                editorOption: {
                    theme: 'bubble'
                },//富文本工具栏
                messageIndex: '',//消息索引
                message: {},
                send: [],//用户已发送的反馈信息
                sendMessageVisible: false,//已发送信息弹框
                sendForm: {}//已发送弹框信息
            };
        },
        created() {
            this.getData();
            this.showSaveMessageList();
            let { pane } = this.$route.params;
            if (pane) {
                this.message_type = pane;
            }
        },
        methods: {
            //查询消息列表
            getData() {
                let params = {
                    user_id: this.user_id
                };
                getMessageByUserId(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.unread = data.unread;
                        this.read = data.read;
                        this.recycle = data.recycle;
                    } else {
                        this.$message.error(`查询消息失败${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询消息失败!');
                });
            },
            //消息标为已读
            handleRead(index, message) {
                const item = this.unread.splice(index, 1);
                let message_id_list = [];
                message_id_list.push(message.id);
                let params = {
                    user_id: this.user_id,
                    message_id_list: message_id_list.toString()
                };
                updateMessageStatus(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.read = item.concat(this.read);
                        EventBus.$emit('changeMessageNum', 'redOneMessage');
                    } else {
                        this.$message.error(`状态修改失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('状态修改失败!');
                });
            },
            //删除单条消息
            handleDel(index, message) {
                const item = this.read.splice(index, 1);
                let message_id_list = [];
                message_id_list.push(message.id);
                let params = {
                    user_id: this.user_id,
                    message_id_list: message_id_list.toString()
                };
                updateMessageNormalToRecycleByList(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.recycle = item.concat(this.recycle);
                    } else {
                        this.$message.error(`删除消息失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('删除消息失败,请重试!');
                });
            },
            //还原单条消息
            handleRestore(index, message) {
                const item = this.recycle.splice(index, 1);
                let message_id_list = [];
                message_id_list.push(message.id);
                let params = {
                    user_id: this.user_id,
                    message_id_list: message_id_list.toString()
                };
                updateMessageRecycleToNormalByList(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.read = item.concat(this.read);
                    } else {
                        this.$message.error(`消息还原失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('消息还原失败!');
                });
            },
            //已读全部
            handleReadAll() {
                let message_id_list = [];
                for (let i = 0; i < this.unread.length; i++) {
                    message_id_list.push(this.unread[i].id);
                }
                let params = {
                    user_id: this.user_id,
                    message_id_list: message_id_list.toString()
                };
                updateMessageStatus(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.read = this.unread.concat(this.read);
                        this.unread = [];
                        EventBus.$emit('changeMessageNum', 'redAllMessage');
                    } else {
                        this.$message.error(`全部已读失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('全部已读失败!');
                });
            },
            //删除全部
            handleDelAll() {
                let message_id_list = [];
                for (let i = 0; i < this.read.length; i++) {
                    message_id_list.push(this.read[i].id);
                }
                let params = {
                    user_id: this.user_id,
                    message_id_list: message_id_list.toString()
                };
                updateMessageNormalToRecycleByList(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.recycle = this.read.concat(this.recycle);
                        this.read = [];
                    } else {
                        this.$message.error(`删除全部失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('删除全部失败!');
                });
            },
            //清空回收站
            handleDestoryAll() {
                let message_id_list = [];
                for (let i = 0; i < this.recycle.length; i++) {
                    message_id_list.push(this.recycle[i].id);
                }
                let params = {
                    user_id:this.user_id,
                    message_id_list:message_id_list.toString()
                };
                updateMessageDestroyByList(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.recycle = [];
                    } else {
                        this.$message.error(`清空回收站失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('清空回收站失败!');
                });
            },
            //查看消息详情
            showMessageDetail(index, message) {
                this.messageVisible = true;
                this.messageForm.title = message.title;
                this.messageForm.priority = message.priority.toString();
                this.messageForm.content = message.content;
                this.messageIndex = index;
                this.message = message;
            },
            //关闭详情
            handleClose() {
                this.handleRead(this.messageIndex, this.message);
                this.messageVisible = false;

            },
            //已发送查看详情
            showSendMessageDetail(index, item) {
                this.sendMessageVisible = true;
                this.sendForm = JSON.parse(JSON.stringify(item));
            },
            //查看已发送消息列表
            showSaveMessageList() {
                let params = {
                    user_id: this.user_id
                };
                getUserSendMessageById(params).then(res => {
                    let { status, msg, data } = res;
                    if (status == 200) {
                        this.send = data;
                    } else {
                        this.$message.error(`查看已发送信息失败：${msg}`);
                    }
                });
            }
        }
    };

</script>

<style>
    .message-title {
        cursor: pointer;
    }

    .handle-row {
        margin-top: 30px;
    }

    .me-quill-editor {
        padding: 0 15px;
        border: 1px solid #DCDFE6;
        background-color: rgba(255, 255, 255, 0.247);
        border-radius: 4px;
        height: 300px;
        overflow: auto;
    }
</style>

