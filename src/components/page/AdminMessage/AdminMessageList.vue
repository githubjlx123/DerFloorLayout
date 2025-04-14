<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 消息管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看消息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container message-container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddMessage">发布消息</el-button>
            </div>
            <el-tabs v-model="activePanName" @tab-click="handlePanClick(activePanName)">
                <el-tab-pane label="已发送" name="send">
                    <div class="search-input">
                        <el-input v-model="checkMessageTitle" placeholder="请输入关键字" class="handle-input mr10"
                                  clearable @keyup.enter.native="handleSearch"></el-input>
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                    </div>

                    <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                        <el-table-column type="index" label="序号" align="center" width="80px">
                            <template slot-scope="scope">
                                <div>{{(pageIndex - 1)*pageSize + scope.$index + 1}}</div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="id" label="消息ID" align="center"></el-table-column>

                        <el-table-column prop="title" label="消息标题" align="center"></el-table-column>

                        <el-table-column prop="publish_time" label="发布时间" align="center"></el-table-column>

                        <el-table-column prop="priority" label="紧急度" align="center">
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

                        <el-table-column prop="is_withdraw" label="发布状态" align="center">
                            <div slot-scope="scope" v-if="scope.row.is_withdraw == 0">
                                <p style="color: green;"><b>【已发布】</b></p>
                            </div>
                            <div slot-scope="scope" v-else-if="scope.row.is_withdraw == 1">
                                <p style="color: gray"><b>【已撤回】</b></p>
                            </div>
                        </el-table-column>

                        <el-table-column prop="read_number" label="已读人数" align="center"></el-table-column>

                        <el-table-column prop="receive_number" label="发送人数" align="center"></el-table-column>

                        <el-table-column label="详细内容" align="center">
                            <el-button slot-scope="scope" type="text" icon="el-icon-search"
                                       @click="showMessageDetail(scope.$index, scope.row)">查看详细
                            </el-button>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-refresh-left" :disabled="scope.row.is_withdraw == 1 ? true : false"
                                           @click="withdrawMessage(scope.$index, scope.row)">撤回消息
                                </el-button>

                                &nbsp; | &nbsp;

                                <el-button type="text" icon="el-icon-delete" class="red"
                                           @click="deleteMessage(scope.$index, scope.row)">删除消息
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                                       :page-size="pageSize" :total="pageTotal"
                                       @current-change="handlePageChange"></el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已接收" name="receive">
                    <el-table :data="feedBackTable" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                        <el-table-column type="index" label="序号" align="center" width="80px">
                            <template slot-scope="scope">
                                <div>{{(feedBackPageIndex - 1)*feedBackPageSize + scope.$index + 1}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="消息ID" align="center"></el-table-column>
                        <el-table-column prop="title" label="消息标题" align="center"></el-table-column>
                        <el-table-column prop="publish_time" label="发布时间" align="center"></el-table-column>
                        <el-table-column label="是否已读" align="center">
                            <template slot-scope="scope">
                                <div :style="{color:( scope.row.is_read  ? 'green':'red')}">{{scope.row.is_read ? '已读': '未读'}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="详细内容" align="center">
                            <el-button slot-scope="scope" type="text" icon="el-icon-search"
                                       @click="handleFeedBackDetail(scope.row)">查看详细
                            </el-button>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="200px">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-s-promotion"
                                           @click="handleFeedBackDetail(scope.row)">回复消息
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination background layout="total, prev, pager, next" :current-page="feedBackPageIndex"
                                       :page-size="feedBackPageSize" :total="feedBackPageTotal"
                                       @current-change="handleFeedBackPageChange"></el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!-- 已发送消息详细结果 -->
        <el-dialog title="详细内容" :visible.sync="messageVisible" width="50%">
            <el-form ref="form" :model="messageForm" label-width="80px">

                <el-form-item label="消息标题">
                    <el-input v-model="messageForm.title"></el-input>
                </el-form-item>

                <el-form-item label="紧急程度">
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

                <el-form-item label="消息内容">
                    <quill-editor v-model="messageForm.content" :options="editorOption"
                                  style="padding: 0 15px;border: 1px solid #DCDFE6;background-color: rgba(255, 255, 255, 0.247);border-radius: 4px;"></quill-editor>
                </el-form-item>

            </el-form>

            <span slot="footer" class="dialog-footer">
				<el-button @click="messageVisible = false">取 消</el-button>
				<el-button type="primary" @click="messageVisible = false">确 定</el-button>
			</span>
        </el-dialog>

        <!-- 已接收消息详细结果 -->
        <el-dialog title="详细内容" :visible.sync="receiveMessageVisible" width="50%" @close="handleCloseDialog">
            <el-form ref="form" :model="receiveMessageForm" label-width="120px">
                <el-form-item label="消息标题">
                    <el-input v-model="receiveMessageForm.title"></el-input>
                </el-form-item>
                <el-form-item label="消息内容">
                    <quill-editor v-model="receiveMessageForm.content" :options="editorOption" class="editor"></quill-editor>
                </el-form-item>
                <el-form-item label="回复消息标题">
                    <el-input v-model="receiveMessageForm.replyTitle"></el-input>
                </el-form-item>
                <el-form-item label="回复消息内容">
                    <quill-editor v-model="receiveMessageForm.reply" class="reply-editor"></quill-editor>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="receiveMessageVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSendReply">回 复</el-button>
             </span>
        </el-dialog>
    </div>

</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import {
        withdrawMessageById,
        deleteMessageById,
        getFuzzyMessagesByAdminId,
        adminAddMessage,
        updateMessageStatus
    } from '@/api/Massage.js';
    import {getUserFeedbackMessage} from '@/api/AdminHome.js';

    export default {
        name: 'messageList',
        components: {
            quillEditor
        },
        data() {
            return {
                admin_id: localStorage.getItem('ms_user_id'),
                pageIndex: 1,//页码
                pageSize: 12,//页面大小
                pageTotal: 0,//总条数
                checkMessageTitle: '',//消息名称搜索输入框
                tableData: [],//消息列表
                messageVisible: false,//消息详情显隐
                messageForm: {
                    receive_user: '1',
                    receive_user_id: '',
                    title: '',
                    priority: '1',
                    content: '',
                    receive_number: '0',
                    read_number: '1'

                },//详情表单
                editorOption: {
                    theme: 'bubble'
                },//富文本框样式
                activePanName:'send',
                feedBackTable:[],//接收意见反馈表格
                feedBackPageIndex:1,//意见反馈表格页码
                feedBackPageSize:12,//意见反馈表格页大小
                feedBackPageTotal:0,//意见反馈表格页大小
                receiveMessageVisible:false,//接收消息弹出框
                receiveMessageForm:{
                    title:'',
                    content:'',
                    replyTitle:'',
                    reply:'',
                    user_id:'',
                },//接收消息表单
            };
        },
        created() {
            this.getMessageTable();
            let { pane } = this.$route.params;
            if (pane) {
                this.activePanName = pane;
            }
        },
        methods: {
            //查询管理员已发送信息
            getMessageTable() {
                let params = {
                    admin_id: this.admin_id,
                    page_index: this.pageIndex,
                    page_size: this.pageSize,
                    message_name:this.checkMessageTitle
                };
                getFuzzyMessagesByAdminId(params).then(res => {
                    let { status, msg, data, total } = res;
                    if (status == 200) {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error(`获取消息列表失败:${msg}!`);
                    }
                }).catch(error => {
                    this.$message.error('获取消息列表失败!');
                });
            },
            //查看消息详情
            showMessageDetail(index, message) {
                this.messageVisible = true;
                this.messageForm.title = message.title;
                this.messageForm.priority = message.priority.toString();
                this.messageForm.content = message.content;
                this.messageForm.receive_number = message.receive_number;
            },
            //消息撤回
            withdrawMessage(index, message) {
                // 二次确认删除
                this.$confirm('确定要撤回消息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = {
                        admin_id: this.admin_id,
                        message_id: message.id
                    };
                    withdrawMessageById(params).then(res => {
                        let { status, msg, data } = res;
                        if (status == 200) {
                            this.$message.success('撤回成功！');
                            this.getMessageTable();
                        } else {
                            this.$message.error('撤回失败:' + msg);
                        }
                    }).catch(error => {
                        this.$message.error('撤回失败!');
                    });
                }).catch(() => {
                });
            },
            //删除消息
            deleteMessage(index, message) {
                // 二次确认删除
                this.$confirm('确定要删除消息吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = {
                        admin_id: this.admin_id,
                        message_id: message.id
                    };
                    deleteMessageById(params).then(res => {
                        let { data, status, msg } = res;
                        if (status == 200) {
                            this.$message.success('消息删除成功！');
                            if(this.pageIndex > 1 && this.tableData.length == 1){
                                this.pageIndex = this.pageIndex -1;
                            }
                            this.getMessageTable();
                        } else {
                            this.$message.error(`消息删除失败:${msg}！`);
                        }
                    }).catch(error => {
                        this.$message.error('消息删除失败!');
                    });
                }).catch(() => {
                });
            },
            //路由跳转到发送消息页面
            toAddMessage() {
                this.$router.push('/admin_addMessagePage');
            },
            // 触发搜索按钮
            handleSearch() {
               this.pageIndex = 1;
               this.getMessageTable();
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getMessageTable();
            },
            //点击面板
            handlePanClick(pane){
                if(pane == 'send'){
                  this.getMessageTable();
                }else if(pane == 'receive'){
                    this.getFeedBackList();
                }
            },
            //查询用户反馈信息
            getFeedBackList() {
                let params = {
                    admin_id: this.admin_id,
                    page_index:this.feedBackPageIndex,
                    page_size:this.feedBackPageSize
                };
                getUserFeedbackMessage(params).then(res => {
                    let { data, status, msg ,total} = res;
                    if (status == 200) {
                        this.feedBackTable = data;
                        this.feedBackPageTotal = total;
                    } else {
                        this.$message.error(`查询用户反馈信息失败:${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询用户反馈信息失败!');
                });
            },
            //意见反馈表格
            handleFeedBackPageChange(val){
                this.feedBackPageIndex = val;
                this.getFeedBackList();
            },
            //用户手动发送回复意见反馈信息
            handleSendReply() {
                if (this.receiveMessageForm.reply && this.receiveMessageForm.replyTitle) {
                    let params = {
                        admin_id: this.admin_id,
                        content: this.receiveMessageForm.reply,
                        priority: '1',
                        receive_user_id: this.receiveMessageForm.user_id,/*this.messageForm.from_user_id*/
                        receive_user_type: '2',
                        title: this.receiveMessageForm.replyTitle
                    };
                    adminAddMessage(params).then(res => {
                        let { status, msg, data } = res;
                        if (status == 200) {
                            this.receiveMessageVisible = false;
                            this.$message.success('已回复用户!');
                        } else {
                            this.$message.error('未成功通知用户:' + msg);
                        }
                    }).catch(error => {
                        this.$message.error('未成功回复用户!');
                    });
                } else {
                    this.$message.warning('回复消息标题或内容不能为空,请补充完整!');
                }
            },
            //管理员查看反馈信息详情
            handleFeedBackDetail(row){
                for(let ele in row){
                    this.receiveMessageForm[ele] = row[ele];
                }
                this.receiveMessageForm.replyTitle = '';
                this.receiveMessageForm.reply = '';
                this.receiveMessageVisible = true;
            },
            //关闭查看详情弹框
            handleCloseDialog() {
                if (this.receiveMessageForm.is_read == 0) {
                    this.handleRead();
                    this.sendReply();
                }
            },
            //已读消息
            handleRead() {
                let message_list = [];
                message_list.push(this.receiveMessageForm.id);
                let params = {
                    user_id: this.admin_id,
                    message_id_list: this.receiveMessageForm.id.toString()
                };
                updateMessageStatus(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.getFeedBackList();
                    }
                });
            },
            //自动发送查看消息
            sendReply() {
                let params = {
                    admin_id: this.admin_id,
                    content: '<p>感谢您对该系统提出的宝贵意见，我们已收到您的反馈信息，技术人员会及时跟进，若意见被采纳，我们将及时与您联系。</p>',
                    priority: '1',
                    receive_user_id: this.receiveMessageForm.user_id,
                    receive_user_type: '2',
                    title: '回复意见反馈信息'
                };
                adminAddMessage(params).then(res => {
                    let { status, msg, data } = res;
                    if (status == 200) {
                    } else {}
                }).catch(error => {
                });

            },
        }
    };
</script>

<style scoped>
    .message-container{
        position: relative;
    }

    .handle-box {
        position: absolute;
        top: 10px;
        right: 0;
        margin-bottom: 20px;
        z-index: 1;
    }

    .search-input{
        margin-bottom: 10px;
        display: flex;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }
    .editor {
        padding: 0 15px;
        border: 1px solid #DCDFE6;
        background-color: rgba(255, 255, 255, 0.247);
        border-radius: 4px;
        height: 200px;
        overflow: auto;
    }

    .reply-editor {
        height: 200px;
        overflow: auto;
        border-bottom: 1px solid #DCDFE6;
    }
</style>
