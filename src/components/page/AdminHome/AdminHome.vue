<template>
    <div class="admin-home">
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card shadow="hover" class="mgb20" style="height:252px;">
                    <div class="user-info">
                        <img src="@assets/img/img.jpg" class="user-avator" alt/>
                        <div class="user-info-cont">
                            <div class="user-info-name">{{name}}</div>
                            <div>{{role}}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        上次登录时间：
                        <span>{{user_local_time}}</span>
                    </div>
                    <div class="user-info-list">
                        上次登录地点：
                        <span>{{user_local}}</span>
                    </div>
                </el-card>
                <el-card shadow="hover" style="height:252px;">
                    <div slot="header" class="clearfix">
                        <span>设备信息</span>
                    </div>
                    <div v-for="(item,index) in deviceList">
                        <span class="device-title"
                              v-if="index != 0">{{item.name}}({{item.used}}G/{{item.total}}G)</span>
                        <span class="device-title" v-else>{{item.name}}</span>
                        <div class="device">
                            <el-progress :percentage="item.percent" :stroke-width="strokeWidth" :format="format"
                                         :color="getColor(index)"
                                         class="device-progress"></el-progress>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="16">
                <el-row :gutter="20" class="mgb20">
                    <el-col :span="8" v-for="(item,index) in popList" :key="index">
                        <el-card shadow="hover" :body-style="{padding: '0px'}">
                            <div class="grid-content " :class="`grid-con-${index + 1}`">
                                <i class=" grid-con-icon" :class="item.icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{item.num}}</div>
                                    <div>{{item.type}}</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>
                <el-card shadow="hover" style="height:403px;overflow: auto;">
                    <div slot="header" class="clearfix">
                        <span>用户意见反馈</span>
                    </div>
                    <div class="feed-back-list">
                        <div v-for="(item,index) in feedBackList" class="list-item" :key="index">
                            <div class="list-item-text item-index">{{(pageIndex - 1) * pageSize + index + 1}}</div>
                            <div class="item-title" :class="[item.is_read == 0 ? 'title-unread':'title-read']"
                                 @click="showMessageDetail(item)">{{item.title}}
                            </div>
                            <div class="list-item-text item-time">{{item.publish_time}}</div>
                            <el-button type="text" icon="el-icon-search"
                                       @click="showMessageDetail(item)">查看详细
                            </el-button>
                        </div>
                    </div>
                    <div class="pagination">
                        <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                                       :page-size="pageSize" :total="pageTotal"
                                       @current-change="handlePageChange"></el-pagination>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-card>
                <div ref="popNumChart" class="chart"></div>
            </el-card>
        </el-row>
        <!-- 详细结果 -->
        <el-dialog title="详细内容" :visible.sync="messageVisible" width="50%" @close="handleCloseDialog">
            <el-form ref="form" :model="messageForm" label-width="120px">
                <el-form-item label="消息标题">
                    <el-input v-model="messageForm.title"></el-input>
                </el-form-item>
                <el-form-item label="消息内容">
                    <quill-editor v-model="messageForm.content" :options="editorOption" class="editor"></quill-editor>
                </el-form-item>
                <el-form-item label="回复消息标题">
                    <el-input v-model="messageForm.replyTitle"></el-input>
                </el-form-item>
                <el-form-item label="回复消息内容">
                    <quill-editor v-model="messageForm.reply" class="reply-editor"></quill-editor>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="messageVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleSendReply">回 复</el-button>
             </span>
        </el-dialog>
    </div>
</template>

<script>
    import {
        getUsersMessageThisDay,
        getServerDeviceMessage,
        getUserFeedbackMessage,
        getUsersAactionMessageRecently
    } from '@/api/AdminHome.js';
    import { updateMessageStatus, adminAddMessage } from '@/api/Massage.js';
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';

    export default {
        name: 'dashboard',
        data() {
            return {
                admin_id: localStorage.getItem('ms_user_id'),
                name: localStorage.getItem('ms_username'),
                user_local: localStorage.getItem('ms_user_last_local'),
                user_local_time: localStorage.getItem('ms_user_last_login_time'),
                deviceList: [],//设备信息list
                colorList: ['#42b983', '#f1e05a', '#b89cf5', '#f56c6c'],//进度条颜色
                popList: [
                    { type: '当日访问量', num: '', icon: 'el-icon-lx-people' },
                    { type: '新增用户', num: '', icon: 'el-icon-user' },
                    { type: '用户总数', num: '', icon: 'el-icon-s-custom' }
                ],//当日用户数量
                strokeWidth: 6,//进度条宽度
                popNumChart: '',//折线图Echart
                popNumChartOption: {
                    title: {
                        text: '用户日访问量'
                    },
                    legend: {
                        data: ['访问量', '新增用户']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    xAxis: {
                        type: 'category',
                        data: []
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name: '访问量',
                            data: [],
                            type: 'line'
                        },
                        {
                            name: '新增用户',
                            data: [],
                            type: 'line'
                        }

                    ]
                },
                messageVisible: false,//消息详情显示开关
                messageForm: {
                    id: '',
                    title: '',
                    content: '',
                    replyTitle: '',
                    reply: ''
                },//消息显示表单
                editorOption: {
                    theme: 'bubble'
                },//编辑框样式
                feedBackList: [],//原始意见反馈信息列表
                showFeedBackList: [],//展示意见反馈信息列表
                pageIndex: 1,
                pageSize: 7,
                pageTotal: 0
            };
        },
        components: {
            quillEditor
        },
        computed: {
            role() {
                return this.name === 'admin' ? '超级管理员' : '普通用户';
            }
        },
        created() {
            this.getFeedBackList();
            this.getTodayMessage();
            this.getDeviceInfo();
            this.getActiveAndRegisterChart();
        },
        mounted() {
            this.initChart();
        },
        methods: {
            //格式化进度条文本显示
            format(percentage) {
                return `${percentage.toFixed(1)}%`;
            },
            //初始化折线图
            initChart() {
                this.popNumChart = this.$echarts.init(this.$refs['popNumChart']);
                this.popNumChart.setOption(this.popNumChartOption);
            },
            //获取进度条颜色
            getColor(index) {
                return this.colorList[index];
            },
            //查看详细
            showMessageDetail(item) {
                this.messageVisible = true;
                for (let ele in item) {
                    this.messageForm[ele] = item[ele];
                }
                this.messageForm.reply = '';
                this.messageForm.replyTitle = '';
            },
            //已读消息
            handleRead() {
                let message_list = [];
                message_list.push(this.messageForm.id);
                let params = {
                    user_id: this.admin_id,
                    message_id_list: this.messageForm.id.toString()
                };
                updateMessageStatus(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.getFeedBackList();
                    }
                });
            },
            //关闭查看详情弹框
            handleCloseDialog() {
                if (this.messageForm.is_read == 0) {
                    this.handleRead();
                    this.sendReply();
                }
            },
            //用户反馈信息分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getFeedBackList();
            },
            //自动发送查看消息
            sendReply() {
                let params = {
                    admin_id: this.admin_id,
                    content: '<p>感谢您对该系统提出的宝贵意见，我们已收到您的反馈信息，技术人员会及时跟进，若意见被采纳，我们将及时与您联系。</p>',
                    priority: '1',
                    receive_user_id: this.messageForm.user_id,
                    receive_user_type: '2',
                    title: '回复意见反馈信息'
                };
                adminAddMessage(params).then(res => {
                    let { status, msg, data } = res;
                    if (status == 200) {
                    } else {
                    }
                }).catch(error => {
                });

            },
            //用户手动发送回复意见反馈信息
            handleSendReply() {
                if (this.messageForm.reply && this.messageForm.replyTitle) {
                    let params = {
                        admin_id: this.admin_id,
                        content: this.messageForm.reply,
                        priority: '1',
                        receive_user_id: this.messageForm.user_id,
                        receive_user_type: '2',
                        title: this.messageForm.replyTitle
                    };
                    adminAddMessage(params).then(res => {
                        let { status, msg, data } = res;
                        if (status == 200) {
                            this.messageVisible = false;
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
            //查询当日用户数量
            getTodayMessage() {
                let params = {
                    admin_id: this.admin_id
                };
                getUsersMessageThisDay(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        //访问量
                        this.popList[0].num = data.active;
                        this.popList[1].num = data.register;
                        this.popList[2].num = data.total;
                    } else {
                        this.$message.error(`查询当日用户数量信息失败:${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询当日用户数量信息失败!');
                });
            },
            //查询设备信息
            getDeviceInfo() {
                let params = {
                    admin_id: this.admin_id
                };
                getServerDeviceMessage(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        let {
                            cpu_message, disk_message, gpu_message, memory_message
                        } = data;
                        //设备信息
                        cpu_message.name = 'CPU';
                        this.deviceList.push(cpu_message);
                        disk_message.name = '硬盘';
                        this.deviceList.push(disk_message);
                        gpu_message.name = 'GPU';
                        this.deviceList.push(gpu_message);
                        memory_message.name = '内存';
                        this.deviceList.push(memory_message);
                    } else {
                        this.$message.error(`查询设备信息失败:${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询设备信息失败!');
                });
            },
            //查询用户反馈信息
            getFeedBackList() {
                let params = {
                    admin_id: this.admin_id,
                    page_index: this.pageIndex,
                    page_size: this.pageSize
                };
                getUserFeedbackMessage(params).then(res => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.feedBackList = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error(`查询用户反馈信息失败:${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询用户反馈信息失败!');
                });
            },
            //查询用户注册和访问情况
            getActiveAndRegisterChart() {
                let params = {
                    admin_id: this.admin_id
                };
                getUsersAactionMessageRecently(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        //用户访问量折线图
                        data.forEach(item => {
                            this.popNumChartOption.xAxis.data.push(item.date);
                            this.popNumChartOption.series[0].data.push(item.active);
                            this.popNumChartOption.series[1].data.push(item.register);
                        });
                        this.popNumChart.setOption(this.popNumChartOption);
                    } else {
                        this.$message.error(`${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('!');
                });
            }
        }
    };
</script>


<style scoped lang="less">
    .admin-home {
        width: 100%;
        height: 100%;
    }

    .device {
        display: flex;
        margin-bottom: 5px;

        .device-num {
            font-size: 14px;
            margin-left: 10px;
        }
    }

    .device-progress {
        flex: 1;
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

    .chart {
        width: 100%;
        height: 200px;
    }

    .el-row {
        margin-bottom: 20px;
    }

    .grid-content {
        display: flex;
        align-items: center;
        height: 100px;
    }

    .grid-cont-right {
        flex: 1;
        text-align: center;
        font-size: 14px;
        color: #999;
    }

    .grid-num {
        font-size: 30px;
        font-weight: bold;
    }

    .grid-con-icon {
        font-size: 50px;
        width: 100px;
        height: 100px;
        text-align: center;
        line-height: 100px;
        color: #fff;
    }

    .grid-con-1 .grid-con-icon {
        background: rgb(45, 140, 240);
    }

    .grid-con-1 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-2 .grid-con-icon {
        background: rgb(100, 213, 114);
    }

    .grid-con-2 .grid-num {
        color: rgb(45, 140, 240);
    }

    .grid-con-3 .grid-con-icon {
        background: rgb(242, 94, 67);
    }

    .grid-con-3 .grid-num {
        color: rgb(242, 94, 67);
    }

    .user-info {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        border-bottom: 2px solid #ccc;
        margin-bottom: 20px;
    }

    .user-avator {
        width: 120px;
        height: 120px;
        border-radius: 50%;
    }

    .user-info-cont {
        padding-left: 50px;
        flex: 1;
        font-size: 14px;
        color: #999;
    }

    .user-info-cont div:first-child {
        font-size: 30px;
        color: #222;
    }

    .user-info-list {
        font-size: 14px;
        color: #999;
        line-height: 25px;
    }

    .user-info-list span {
        margin-left: 70px;
    }

    .mgb20 {
        margin-bottom: 20px;
    }

    .todo-item {
        font-size: 14px;
    }

    .todo-item-del {
        text-decoration: line-through;
        color: #999;
    }

    .schart {
        width: 100%;
        height: 300px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 80px;
        height: 80px;
    }

    .feed-back-list {
        .list-item {
            display: flex;
            font-size: 14px;
            line-height: 14px;
            padding: 2px 0;
            border-bottom: 1px solid #ebeef5;
            align-items: center;
        }

        .list-item-text {
            text-align: center;
        }

        .item-index {
            margin-right: 20px;
        }

        .item-title {
            flex: 1;
            cursor: pointer;
        }

        .item-title:hover {
            color: #409EFF;
        }

        .item-time {
            margin-right: 10px;
        }

        .title-unread {
            color: #333333;
        }

        .title-read {
            color: #999999;
        }
    }

</style>
