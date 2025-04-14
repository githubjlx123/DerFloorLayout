<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 模型
                </el-breadcrumb-item>
                <el-breadcrumb-item>训练模型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>


        <div class="container">
            <!-- 模型信息部分 -->
            <el-card shadow="hover" class="table-card" id="model-info">
                <div slot="header" class="clearfix">
                    <span>模型信息</span>
                </div>
                <el-table :data="tableModelData" border class="table" ref="multipleTable"
                          header-cell-class-name="table-header">

                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                    <el-table-column prop="model_id" label="模型ID" align="center"></el-table-column>

                    <el-table-column prop="model_name" label="模型名称" align="center"></el-table-column>

                    <el-table-column prop="dataset_id" label="数据集ID" align="center"></el-table-column>

                    <el-table-column prop="dataset_name" label="数据集名称" align="center"></el-table-column>

                    <el-table-column prop="train_cost" label="训练时长" align="center"></el-table-column>

                    <el-table-column prop="train_status" label="模型状态" align="center">
                        <div slot-scope="scope" v-if="scope.row.train_status == 'run'">
                            <el-tag type="normal">训练中...</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.train_status == 'done'">
                            <el-tag type="success">训练完成</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.train_status == 'break'">
                            <el-tag type="warning">训练终止</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.train_status == 'error'">
                            <el-tag type="danger">训练异常</el-tag>
                        </div>
                    </el-table-column>
                </el-table>
                <el-table :data="tableModelData" border class="table" ref="multipleTable"
                          header-cell-class-name="table-header">

                    <el-table-column prop="network" label="网络模型" align="center"></el-table-column>
                    <el-table-column prop="detail" label="模型介绍" align="center"></el-table-column>

                    <el-table-column prop="accuracy" label="准确率" align="center"></el-table-column>

                    <el-table-column label="模型操作" align="center" id="set-model-status">
                        <div slot-scope="scope" v-if="scope.row.train_status == 'run'">
                            <el-button style="height: 50%;" type="danger" icon="el-icon-edit" @click="breakTrain()">
                                中断训练
                            </el-button>
                        </div>
                        <div slot-scope="scope" v-else>
                            <el-button :disabled="scope.row.train_status === 3" type="text" icon="el-icon-edit" @click="toTestModel(scope.row)">
                                立即测试
                            </el-button>
                            <el-button v-if="scope.row.train_status == '2' || (scope.row.train_status == '3' && notNetWorkInitError)" icon="el-icon-refresh-right" type="text"
                                       @click="reStartTrain">继续训练
                            </el-button>
                        </div>
                    </el-table-column>
                </el-table>
            </el-card>

            <el-row :gutter="24">
                <el-col :span="12" id="model-loss-line">
                    <el-card>
                        <div id="LossLine" class="LossChart"></div>
                    </el-card>
                </el-col>
                <el-col :span="12" id="model-status">
                    <el-card shadow="hover">
                        <h4>【模型训练状态】</h4><br>
                        <p>训练开始时间：{{start_date}}</p>
                        <br>
                        <p>训练时长：{{train_cost}}</p>
                        <br>
                        <p>训练进度：</p>
                        <br>
                        <el-progress :percentage="process" color="#66CCFF"></el-progress>
                        <br>
                        <h4>【模型训练结果】</h4>
                        <br>
                        <br>
                        <div class="round-chart">
                            <div class="leftBox12">
                                <el-progress :width="128" :height="128" type="circle" :percentage="accuracy">
                                </el-progress>
                                <p align="center">准确率</p>
                            </div>
                            <div class="leftBox12">
                                <el-progress :width="128" :height="128" type="circle" :percentage="f1_score">
                                </el-progress>
                                <p align="center">F1得分</p>
                            </div>
                            <div class="leftBox12">
                                <el-progress :width="128" :height="128" type="circle" :percentage="recall">
                                </el-progress>
                                <p align="center">检出率</p>
                            </div>
                            <div class="leftBox12">
                                <el-progress :width="128" :height="128" type="circle" :percentage="precision">
                                </el-progress>
                                <p align="center">过杀率</p>
                            </div>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <HelpButton @click.native="showModelDetailHelp(true)" ref="helpModelRef"></HelpButton>
    </div>
</template>

<script>
    import { getModelTrainMessageById, breakTrainByModelId, restoreTrain } from '@/api/ModelManage.js';
    import {firstUseUserModelDetail} from '@/help/model/UserModelDetail.js'
    import HelpButton from '@/components/common/mComponents/HelpButton.vue'

    export default {
        name: 'trainClassify',
        components:{
            HelpButton
        },
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                model_id: localStorage.getItem('ms_model_id'),
                accuracy: 0,
                f1_score: 0,
                precision: 0,
                recall: 0,
                process: 0,//模型训练进度
                start_date: '',//开始时间
                train_cost: '',//结束时间
                tableModelData: [{
                    'model_id': '',
                    'name': '',
                    'dataset_id': '',
                    'dataset_name': '',
                    'time_cost': '',
                    'status': ''
                }],//模型详细信息表格
                lossChart: null,//损失Echart
                lossChartOption: {
                    title: {
                        text: '模型损失趋势图',
                        x: 'center',
                        y: 'top'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data: ['损失'],
                        top: '30px'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
                    },
                    yAxis: {
                        type: 'value',
                        axisLine: {
                            show: true
                        }
                    },
                    series: [
                        {
                            data: [],
                            type: 'line',
                            name: '损失',
                            itemStyle: {
                                normal: {
                                    label: { show: true }
                                }
                            }
                        }
                    ],
                    animation: true,
                    animationDuration: 2000,
                    animationEasing: 'cubicInOut'
                },//Echart 渲染值
                notNetWorkInitError:false,//用于判断是否是网络初始化异常，用来显示异常的模型是否可以恢复
            };
        },
        mounted() {
            this.getTrainInfo();
            this.initLossChart();
            this.showModelDetailHelp()
        },
        methods: {
            //初始化Echart图
            initLossChart() {
                this.lossChart = this.$echarts.init(document.getElementById('LossLine'));
                this.lossChart.setOption(this.lossChartOption);
            },
            //查询训练信息
            getTrainInfo() {
                let params = {
                    user_id: this.user_id,
                    model_id: this.model_id
                };
                getModelTrainMessageById(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        let { accuracy, f1_score, precision, recall, model, log_info } = data;
                        this.tableModelData = [];
                        this.tableModelData.push(model);//模型详细信息
                        this.notNetWorkInitError = false;//赋初始值
                        //历史损失率
                        if (log_info.length > 0) {
                            this.notNetWorkInitError = true;//log中有值表示非网络初始化异常
                            let datas = [];
                            let labels = [];
                            for (let i = log_info.length - 1; i >= 0; i--) {
                                datas.push(log_info[i].toFixed(2));
                                labels.push(i);
                            }
                            datas.reverse();
                            labels.reverse();
                            this.lossChartOption.xAxis.data = labels;
                            this.lossChartOption.series[0].data = datas;
                            this.lossChart.hideLoading();
                            this.lossChart.setOption(this.lossChartOption);
                        } else {
                            this.lossChart.showLoading({
                                text: '初始化模型中....',
                                color: '#409EFF',
                                textColor: '#409EFF',
                                zlevel: 0
                            });
                        }
                        //模型训练结果环状图
                        this.accuracy = (parseFloat(accuracy) * 100).toFixed(2);
                        this.f1_score = (parseFloat(f1_score) * 100).toFixed(2);
                        this.precision = ((1 - parseFloat(precision)) * 100).toFixed(2);
                        this.recall = (parseFloat(recall) * 100).toFixed(2);
                        this.start_date = model.start_date;
                        this.train_cost = model.train_cost;
                        this.process = parseFloat((model.cur_step * 100 / model.total_step).toFixed(1));
                        if (model.train_status == 'run') {
                            this.createSetInterval();//进行轮询
                        } else {
                            this.stopSetInterval();//停止轮询
                        }
                    } else {
                        this.$message.error(`查询模型信息失败:${msg}！`);
                        this.stopSetInterval();//停止轮询
                    }
                }).catch(error => {
                    this.$message.error('查询模型信息失败!');
                    this.stopSetInterval();//停止轮询
                });
            },
            //中断训练
            breakTrain() {
                let params = {
                    user_id: this.user_id,
                    model_id: this.model_id
                };
                breakTrainByModelId(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.getTrainInfo();
                        this.$message.success('终止成功！');
                    } else {
                        this.getTrainInfo();
                        this.$message.error(`终止训练失败:${msg}！`);
                    }
                }).catch(error => {
                    this.getTrainInfo();
                    this.$message.error('终止训练失败!');
                });
            },
            // 开启轮询  如果存在则先销毁定时器后重新开启
            createSetInterval() {
                this.stopSetInterval();
                let _this = this;
                this.timer = setInterval(() => {
                    _this.getTrainInfo();
                }, 3000);
            },
            // 关闭轮询
            stopSetInterval() {
                if (this.timer) {
                    clearInterval(this.timer);
                    this.timer = null;
                }
            },
            // 跳转至模型测试页面
            toTestModel(row) {
                this.$router.push({ name: 'testOncePage', params: row });
            },
            //恢复训练
            reStartTrain() {
                let params = {
                    user_id:this.user_id,
                    model_id:this.model_id
                };
                restoreTrain(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.getTrainInfo();
                    } else {
                        this.$message.error(`恢复训练失败:${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('恢复训练失败!');
                });
            },
            //是否展示模型信息引导
            showModelDetailHelp(isHelpByUserNeed=false){
                isHelpByUserNeed && this.$refs.helpModelRef.toggleLocalstorage('isFirstUserModelDetail')
                this.$nextTick(()=>{
                    firstUseUserModelDetail()
                })
            }
        },
        beforeDestroy() {
            this.stopSetInterval();
            this.lossChart = null;
            this.lossChartOption = null;
        }
    };
</script>

<style scoped lang="less">
    .LossChart {
        width: 100%;
        height: 400px;
    }
    .round-chart {
        display: flex;
        align-items: center;
        justify-content: center;
        align-content: space-between;

        .leftBox12 {
            text-align: center;
            flex: 1;
        }
    }

    .table-card{
        margin-bottom: 10px;
    }
</style>
