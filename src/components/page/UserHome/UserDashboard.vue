<template>
    <div class="page-panel">
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 左侧用户信息卡片 -->
                <el-card shadow="hover" class="mgb20" style="height: 222px">
                    <div class="user-info">
                        <img :src="getUserImage()" class="user-avator" alt />
                        <div class="user-info-cont">
                            <div class="user-info-name" :title="username">{{ username | filterUserName }}</div>
                            <div>{{ role }}</div>
                        </div>
                    </div>
                    <div class="user-info-list">
                        最新登录时间：
                        <span>{{ user_local_time }}</span>
                    </div>
                    <!-- <div class="user-info-list">
                        最新登录地点：
                        <span>{{ user_local ? user_local : '未知' }}</span> 
                    </div> -->
                </el-card>

                <!-- 左侧最新铺装方案模拟卡片 -->
                <el-card shadow="hover" style="height: 343px" id="pave-stats-card">
                    <div slot="header" class="clearfix">
                        <span>
                            <i class="el-icon-data-line"></i> 近7日数据统计
                            <el-button 
                                style="float: right; margin-top: -5px" 
                                type="text" 
                                icon="el-icon-refresh" 
                                @click="refreshStats"
                            ></el-button>
                        </span>
                    </div>


                    <div class="stats-container">
                        <!-- 左侧统计数据 -->
                        <div class="stats-data">
                            <div class="stat-item">
                                <div class="stat-icon">
                                    <i class="el-icon-document"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ recentPaveInfo.total_num }}</div>
                                    <div class="stat-label">总方案数</div>
                                </div>
                            </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon" style="color: #F56C6C;">
                                    <i class="el-icon-top"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ recentPaveInfo.max_loss }}%</div>
                                    <div class="stat-label">最大损耗率</div>
                                </div>
                            </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon" style="color: #67C23A;">
                                    <i class="el-icon-bottom"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ recentPaveInfo.min_loss }}%</div>
                                    <div class="stat-label">最小损耗率</div>
                                </div>
                            </div>
                            
                            <div class="stat-item">
                                <div class="stat-icon" style="color: #E6A23C;">
                                    <i class="el-icon-s-data"></i>
                                </div>
                                <div class="stat-content">
                                    <div class="stat-value">{{ recentPaveInfo.avg_loss }}%</div>
                                    <div class="stat-label">平均损耗率</div>
                                </div>
                            </div>
                        </div>

                    <!-- 右侧仪表盘 -->
                        <div class="stats-gauge">
                            <div class="gauge-title">平均损耗率</div>
                            <!-- <div class="gauge-container" ref="lossGauge"></div> -->
                            <div class="gauge-container" ref="lossChart"></div>
                        </div>
                    </div>
                </el-card>
            </el-col>

            <el-col :span="16">
                <el-row :gutter="20" class="mgb20" id="project-count">
                    <!-- 项目数量 -->
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-1">
                                <i class="el-icon-folder grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ project_num }}</div>
                                    <div>项目数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <!-- 户型数量-->
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-2">
                                <i class="el-icon-picture grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ house_num }}</div>
                                    <div>户型数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                    <!-- 铺装方案数量-->
                    <el-col :span="8">
                        <el-card shadow="hover" :body-style="{ padding: '0px' }">
                            <div class="grid-content grid-con-3">
                                <i class="el-icon-video-camera grid-con-icon"></i>
                                <div class="grid-cont-right">
                                    <div class="grid-num">{{ room_num }}</div>
                                    <div>铺装房间数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 主要内容区 -->
                <div class="main-content">
                    <!-- 快捷入口 -->
                    <el-card shadow="hover" class="quick-actions-card">
                    <div slot="header" class="card-header">
                        <span>快捷操作</span>
                    </div>
                    <div class="quick-actions">
                        <el-button 
                        type="primary" 
                        icon="el-icon-plus" 
                        @click="goToPage('/projectAddPage')"
                        >新建项目</el-button>
                        <el-button 
                        type="success" 
                        icon="el-icon-house" 
                        @click="goToPage('/houseAddPage')"
                        >添加户型</el-button>
                        <el-button 
                        type="warning" 
                        icon="el-icon-crop" 
                        @click="goToPage('/paveSimulatePage')"
                        >铺装模拟</el-button>
                        <el-button 
                        type="info" 
                        icon="el-icon-document" 
                        @click="goToPage('/paveListPage')"
                        >查看所有方案</el-button>
                    </div>
                    </el-card>
            
                    <!-- 最近项目 -->
                    <el-card shadow="hover" class="recent-card">
                    <div slot="header" class="card-header">
                        <span>最近项目</span>
                        <el-button 
                        type="text" 
                        @click="goToPage('/projectListPage')"
                        >查看全部</el-button>
                    </div>
                    <div v-if="projects.length > 0" class="project-grid">
                        <div 
                        v-for="project in projects" 
                        :key="project.id" 
                        class="project-item"
                        @click="checkProjectDetail(project.id)"
                        >
                        <el-image 
                            :src="$serverUrl + project.image" 
                            class="project-thumbnail"
                            fit="cover"
                        ></el-image>
                        <div class="project-info">
                            <div class="project-name">{{ project.name | filterName }}</div>
                            <div class="project-meta">
                            <span><i class="el-icon-time"></i> 最近更新</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    <el-empty v-else description="暂无项目数据" style="height: 200px;"></el-empty>
                    </el-card>

                </div>
            </el-col>
        </el-row>


        <el-row :gutter="20">
            <!-- 最近铺装方案 -->
            <el-card shadow="hover" class="recent-card">

            <div slot="header" class="card-header">
                <span>最近铺装方案</span>
                <el-button 
                type="text" 
                @click="goToPage('/paveListPage')"
                >查看全部</el-button>
            </div>
            
            <el-table 
                :data="tableData" 
                style="width: 100%"
                class="pave-table"
                :row-class-name="tableRowClassName"
            >

                <el-table-column label="方案id" width="60" align="center">
    
                    <template slot-scope="scope" align="center">
                        <div class="pave-name">
                            <el-tag size="mini" align="center">{{ scope.row.pave_id }}</el-tag>
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="方案名称" width="120" align="center">
 
                    <template slot-scope="scope" align="center">
                        <div class="pave-name">
                            <span class="name-text">{{ scope.row.pave_name }}</span>
                            <!-- <el-tag size="mini">{{ scope.row.pave_id }}</el-tag> -->
                        </div>
                    </template>
                </el-table-column>

                <el-table-column label="铺装模拟时间" width="200" align="center">
                <template slot-scope="scope">
                    <div class="pave-stats">
                    <div>{{ scope.row.create_time }} </div>
                    <!-- <div>地板: {{ scope.row.count }}片</div> -->
                    </div>
                </template>
                </el-table-column>

                
                <el-table-column label="所属项目/户型" width="200" align="center">
                <template slot-scope="scope">
                    <div class="pave-location">
                    <div>{{ scope.row.project_name }}</div>
                    <div class="house-name">{{ scope.row.house_name }}</div>
                    </div>
                </template>
                </el-table-column>
                
                <el-table-column label="铺装面积" width="160" align="center">
                <template slot-scope="scope">
                    <div class="pave-stats">
                    <div>面积: {{ (scope.row.need_area / 1000000).toFixed(2) }} m²</div>
                    <!-- <div>地板: {{ scope.row.count }}片</div> -->
                    </div>
                </template>
                </el-table-column>

                <!-- <el-table-column label="踢脚线总长" width="220" align="center">
                <template slot-scope="scope">
                    <div class="pave-stats">
                    <div>长度: {{ (scope.row.total_length / 1000).toFixed(2) }} m</div>
                    </div>
                </template>
                </el-table-column> -->

                <el-table-column label="地板规格" width="160" align="center">
                <template slot-scope="scope">
                    <div class="pave-stats">
                    <div>{{ scope.row.floor_width }} x {{scope.row.floor_height}} mm</div>
                    </div>
                </template>
                </el-table-column>

                <el-table-column label="地板数量" width="200" align="center">
                <template slot-scope="scope">
                    <div class="pave-location">
                        <div>{{ scope.row.count }} 片</div>
                        <div  class="house-name"> （整铺{{ scope.row.fully_floor_num }}片，裁剪{{scope.row.partly_floor_num}}片）</div>
                    </div>
                </template>
                </el-table-column>
                
                <el-table-column label="损耗率" align="center">
                <template slot-scope="scope">
                    <el-tooltip :content="`损耗率: ${scope.row.pave_loss}%`" placement="top">
                    <el-progress 
                        :percentage="parseFloat(scope.row.pave_loss)" 
                        :color="getLossColor(parseFloat(scope.row.pave_loss))"
                        :stroke-width="16"
                        :show-text="false"
                    ></el-progress>
                    </el-tooltip>
                    <div class="loss-value">{{ scope.row.pave_loss }}</div>
                </template>
                </el-table-column>
                
                <el-table-column label="状态" width="80" align="center">
                    <template slot-scope="scope">
                        <el-tag 
                        :type="getStatusType(scope.row.status)"
                        effect="dark"
                        >{{ getStatusText(scope.row.status) }}</el-tag>
                    </template>
                </el-table-column>
                
                <el-table-column label="操作" width="200" align="center">
                <template slot-scope="scope">
                    <el-button 
                    size="mini" 
                    @click="checkPaveDetail(scope.$index, scope.row.pave_id)"
                    >详情</el-button>
                    <el-button 
                    size="mini" 
                    type="danger" 
                    @click="deleteModel(scope.row.pave_id)"
                    >删除</el-button>
                </template>
                </el-table-column>
            </el-table>
            
            <div class="pagination-wrapper" style="float: right;margin-right: 30px;">
                <el-pagination
                background
                layout="prev, pager, next"
                :current-page="pageIndex"
                :page-size="pageSize"
                :total="pageTotal"
                @current-change="handlePageChange"
                ></el-pagination>
            </div>
            </el-card>
        </el-row>
        <HelpButton @click.native="showHomeInfoHelp(true)" ref="helpHomeRef"></HelpButton>
    </div>
</template>

<script>
import { deleteRoomById, getLastRoomsByUserId } from '@/api/RoomManage.js';
import { getSumByUserId, getLastProjectsByUserId, getLastHousesByUserId, getNewestRoomByUserId } from '@/api/UserHome.js';
import {getFuzzyPaveByUserId, getRecentPaveByUserId} from '@/api/PaveManage.js';

import HelpButton from '@/components/common/mComponents/HelpButton.vue';
import { byteLength } from '@utils/common.js';
import EventBus from '@utils/bus.js';
import { sparseDependencies } from 'mathjs';

import * as echarts from 'echarts';


export default {
    name: 'dashboard',
    components: {
        HelpButton
    },
    data() {
        return {
            username: localStorage.getItem('ms_username'), //用户名
            user_type: localStorage.getItem('ms_user_type'), //用户类型
            user_id: localStorage.getItem('ms_user_id'), //用户ID
            user_image: localStorage.getItem('ms_user_image'), //用户头像
            user_local: localStorage.getItem('ms_user_last_local'), //上次登录地址
            user_local_time: localStorage.getItem('ms_user_last_login_time'), //上次登录时间
            house_num: '', //户型个数
            room_num: '', //铺装方案个数
            project_num: '', //项目个数
            houses: [], //户型列表
            projects: [], //项目列表
            tableData: [], //最新铺装方案列表
            recentPaveList: [],
            recentPaveInfo: {
                "total_num": 0,
                "max_loss": 0,
                "min_loss": 0,
                "avg_loss": 0
            },
            pageIndex: 1,
            pageSize: 6,
            pageTotal: 0,
            lastRoomMessage: {
                project_id: '',
                project_name: '暂无数据',
                process: 100,
                loss: 0,
                accuracy: 0
            }, //最新铺装方案详情
            lossChart: null
        };
    },
    computed: {
        role() {
            return this.user_type === 'user' ? '普通用户' : '管理员';
        }
    },
    beforeDestroy() {
        if (this.lossChart) {
            this.lossChart.dispose();
        }
    },
    filters: {
        filterName(str) {
            let byt = byteLength(str);
            if (byt > 14) {
                return str.substr(0, 7) + '...';
            } else {
                return str;
            }
        },
        filterUserName(name) {
            let resName = name;
            if (!resName) {
                return 'unknown';
            } else if (resName.length > 10) {
                return resName.substring(0, 9) + '...';
            } else {
                return resName;
            }
        }
    },
    created() {
        this.getSum();
        this.getProjectList();
        this.getHouseList();
        this.getPaveList();
        this.getRecentPaveList();
    },
    mounted() {
        EventBus.$on('firstUseNavOver', this.showHomeInfoHelp); //导航引导结束,通知继续引导home详细面板
    },
    beforeDestroy() {
        EventBus.$off('firstUseNavOver');
    },
    methods: {
        // 数字格式修改
        formatNumberWithCommas(cellValue) {
            // 处理可能的 null 或 undefined 值
            if (cellValue == null) return '';
            
            // 将数字转换为字符串并添加千位分隔符
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
            // return Number(cellValue).toLocaleString('en-US');
        },
        //查询铺装列表
        getPaveList() {
            let params = {
                user_id: this.user_id,
                pave_name: this.checkPlanName,
                page_index:this.pageIndex,
                page_size:this.pageSize,
                pave_name: ""
            };
            getFuzzyPaveByUserId(params).then(res => {
                let {data,status,msg,total} = res;
                if(status == 200){
                    this.tableData = data;
                    this.pageTotal = total;
                }else {
                    this.$message.error('查询铺装信息失败:'+msg);
                }
            }).catch(error => {
                this.$message.error('查询铺装信息失败!');
            });
        },
        // 获取最近7日的铺装数据
        getRecentPaveList() {
            const loading = this.$loading({
                lock: true,
                text: '加载统计数据中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            
            let params = {
                user_id: this.user_id
            };
            
            getRecentPaveByUserId(params).then(res => {
            let { data, status, msg } = res;
                if (status == 200) {
                    this.recentPaveList = data || [];
                    this.processRecentPaveData();
                } else {
                    this.$message.error(`查询铺装信息失败:${msg}！`);
                }
                }).catch(error => {
                    this.$message.error('查询铺装信息失败!');
                }).finally(() => {
                    loading.close();
            });
        },
        // 处理最近铺装数据
        processRecentPaveData() {
            if (!this.recentPaveList || this.recentPaveList.length === 0) {
                this.recentPaveInfo = {
                    total_num: 0,
                    max_loss: 0,
                    min_loss: 0,
                    avg_loss: 0
                };

                // 初始化图表
                this.$nextTick(() => {
                    this.initLossChart();
                });
                
                return;
            }
            
            // 提取所有损耗率并转换为数字
            const lossRates = this.recentPaveList.map(item => {
                // 去除百分号并转换为数字
                return parseFloat(item.pave_loss.replace('%', '').trim());
            });
            
            // 计算统计数据
            this.recentPaveInfo = {
                total_num: this.recentPaveList.length,
                max_loss: Math.max(...lossRates).toFixed(2),
                min_loss: Math.min(...lossRates).toFixed(2),
                avg_loss: (lossRates.reduce((a, b) => a + b, 0) / lossRates.length).toFixed(2)
            };
            
            // 初始化图表
            this.$nextTick(() => {
                this.initLossChart();
            });
        },
        //用户头像
        getUserImage() {
            this.user_image = localStorage.getItem('ms_user_image');
            return `${this.$serverUrl}${this.user_image}?${new Date().getTime()}`;
        },
        //查询用户项目、户型、铺装方案总数
        getSum() {
            let params = {
                user_id: this.user_id
            };
            getSumByUserId(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        for (let ele in data) {
                            this[ele] = data[ele];
                        }
                    } else {
                        this.$message.error(`查询汇总失败：${msg}！`);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询汇总失败!');
                });
        },
        //查询最新的项目
        getProjectList() {
            let params = {
                user_id: this.user_id
            };
            getLastProjectsByUserId(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.projects = data.projects;
                    } else {
                        this.$message.error(`${msg}！`);
                    }
                })
                .catch((error) => {
                    this.$message.error('!');
                });
        },
        
        //查询户型
        getHouseList() {
            let params = {
                user_id: this.user_id
            };
            getLastHousesByUserId(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.houses = data.houses;
                    } else {
                        this.$message.error(`${msg}！`);
                    }
                })
                .catch((error) => {
                    this.$message.error('!');
                });
        },
        // //查询铺装方案列表
        // getRoomList() {
        //     let params = {
        //         user_id: this.user_id
        //     };
        //     getLastRoomsByUserId(params)
        //         .then((res) => {
        //             let { data, status, msg, total } = res;
        //             if (status == 200) {
        //                 this.tableData = data;
        //             } else {
        //                 this.$message.error(`查询最新铺装方案信息失败：${msg}！`);
        //             }
        //         })
        //         .catch((error) => {
        //             this.$message.error('查询最新铺装方案信息失败!');
        //         });
        // },
        // //查询最新铺装方案信息
        // getNewRoomInfo() {
        //     let params = {
        //         user_id: this.user_id
        //     };
        //     getNewestRoomByUserId(params)
        //         .then((res) => {
        //             let { data, status, msg } = res;
        //             if (status == 200) {
        //                 if (data.loss > 100) {
        //                     data.loss = 100;
        //                 }
        //                 for(let ele in data){
        //                     if(ele == 'project_name'){
        //                         this.lastRoomMessage[ele] = data[ele];
        //                     } else {
        //                         this.lastRoomMessage[ele] = parseFloat(data[ele]);
        //                     }
        //                 }
        //             } else {
        //                 this.$message.error(`查询最新铺装方案信息失败:${msg}！`);
        //             }
        //         })
        //         .catch((error) => {
        //             this.$message.error('查询最新铺装方案信息失败!');
        //         });
        // },
        //点击铺装方案详情
        checkPaveDetail(index, pave_id) {
            localStorage.setItem('ms_user_id', this.user_id);
            localStorage.setItem('ms_pave_id', pave_id);
            this.$router.push('/paveDetailPage');
        },
        //删除铺装方案
        deleteRoomById(room_id) {
            // 二次确认删除
            this.$confirm('确定要删除该铺装方案吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        user_id: this.user_id,
                        room_id: room_id
                    };
                    deleteRoomById(params)
                        .then((res) => {
                            let { status, msg } = res;
                            if (status == 200) {
                                this.$message.success('删除铺装方案成功！');
                                this.getRoomList();
                            } else {
                                this.$message.error('删除铺装方案失败:' + msg);
                            }
                        })
                        .catch((error) => {
                            this.$message.error('删除铺装方案失败！');
                        });
                })
                .catch(() => {
                    this.$message.info('取消删除铺装方案!');
                });
        },
        //项目详情
        checkProjectDetail(project_id) {
            localStorage.setItem('ms_project_id', project_id);
            this.$router.push('/projectDetailPage');
        },
        //户型详情
        checkHouseDetail(house_id) {
            localStorage.setItem('ms_house_id', house_id);
            this.$router.push('/houseDetailPage');
        },
        //页面跳转
        goToPage(path) {
            this.$router.push(path);
        },
        //铺装方案测试
        handleTest(index, row) {
            this.$router.push({ name: 'testOncePage', params: row });
        },
        // 分页导航
        handlePageChange(val) {
            this.pageIndex = val;
            this.getPaveList();
        },

                    
        getProgressColor(percentage) {
            if (percentage >= 90) return '#67C23A';
            if (percentage >= 70) return '#E6A23C';
            return '#F56C6C';
        },
        
        getLossColor(percentage) {
            if (percentage <= 5) return '#67C23A';
            if (percentage <= 10) return '#E6A23C';
            return '#F56C6C';
        },
        
        getStatusType(status) {
            const types = {
            '1': 'success',  // 完成
            '0': 'info',     // 进行中
            '2': 'warning',  // 已终止
            '3': 'danger'    // 异常
            };
            return types[status] || '';
        },
        
        getStatusText(status) {
            const texts = {
            '1': '已完成',
            '0': '进行中',
            '2': '已终止',
            '3': '异常'
            };
            return texts[status] || '';
        },
        
        tableRowClassName({row}) {
            return row.status === '3' ? 'warning-row' : '';
        },

        initLossChart() {
            if (!this.recentPaveInfo.avg_loss){
                this.recentPaveInfo.avg_loss = 0
            }
            
            const chartDom = this.$refs.lossChart;
            if (!chartDom) return;
            
            this.lossChart = echarts.init(chartDom);
            
            const lossValue = parseFloat(this.recentPaveInfo.avg_loss);
            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [{
                    name: '近期平均损耗率',
                    type: 'gauge',
                    min: 0,
                    max: 10,
                    splitNumber: 5,
                    radius: '90%',
                    axisLine: {
                        lineStyle: {
                            width: 15,
                            color: [
                                [0.3, '#67C23A'],
                                [0.7, '#E6A23C'],
                                [1, '#F56C6C']
                            ]
                        }
                    },
                    pointer: {
                        itemStyle: {
                            color: 'auto'
                        }
                    },
                    axisTick: {
                        distance: -15,
                        length: 8,
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    splitLine: {
                        distance: -15,
                        length: 15,
                        lineStyle: {
                            color: '#fff',
                            width: 2
                        }
                    },
                    axisLabel: {
                        color: 'auto',
                        distance: 20,
                        fontSize: 12
                    },
                    detail: {
                        valueAnimation: true,
                        formatter: '{value}%',
                        color: 'auto',
                        fontSize: 24,
                        fontWeight: 'bold'
                    },
                    data: [{
                        value: lossValue,
                        name: '损耗率'
                    }]
                }]
            };
            
            this.lossChart.setOption(option);
            
            // 响应式调整
            window.addEventListener('resize', this.resizeChart);
        },
        
        // 图表响应式调整
        resizeChart() {
            if (this.lossChart) {
                this.lossChart.resize();
            }
        },
        
        // 刷新数据
        refreshStats() {
            this.getRecentPaveList();
        }
    }
};
</script>


<style scoped lang="less">
.red {
    color: #ff0000;
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

.table-td-thumb {
    border-top: 10px;
    display: block;
    margin: auto;
    width: 137px;
    height: 77px;
    padding: 10px 10px 0 10px;
}

.list-panel {
    display: flex;
    align-items: center;
    justify-content: flex-start;
}

.list-header {
    display: flex;
    border-bottom: 1px solid #cccccc;
    margin-bottom: 10px;

    .header-title {
        flex: 1;
    }
}

.project-item {
    cursor: pointer;
    margin-right: 20px;
}

.project-empty {
    width: 100%;
    text-align: center;

    /deep/ .el-empty {
        padding: 0;
    }
}

.project-item-child {
    border: dashed 1px gray;
    border-radius: 10px;
}

.project-word {
    text-align: center;
    color: gray;
    height: 20px;
    line-height: 20px;
}

// ==========================================

  .dashboard-container {
    padding: 20px;
  }
  
  /* 用户卡片样式 */
  .user-card {
    height: 100%;
    
    .user-profile {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      
      .user-avatar {
        margin-bottom: 15px;
      }
      
      .user-meta {
        .user-name {
          margin: 0 0 10px 0;
          font-size: 18px;
          color: #303133;
        }
        
        .user-login-info {
          margin-top: 10px;
          font-size: 12px;
          color: #909399;
          
          span {
            display: block;
            line-height: 1.6;
          }
        }
      }
    }
  }
  
  /* 统计卡片样式 */
  .stat-card {
    height: 100%;
    min-height: 120px;
    
    .stat-content {
      display: flex;
      align-items: center;
      height: 100%;
      
      .stat-icon {
        font-size: 40px;
        margin-right: 20px;
        padding: 15px;
        border-radius: 50%;
        color: white;
      }
      
      .project-icon {
        background: linear-gradient(135deg, #409EFF, #79BBFF);
      }
      
      .house-icon {
        background: linear-gradient(135deg, #67C23A, #95DE64);
      }
      
      .pave-icon {
        background: linear-gradient(135deg, #E6A23C, #F3D19E);
      }
      
      .stat-info {
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
  
  /* 铺装概览卡片 */
  .pave-overview-card {
    margin-top: 20px;
    
    .pave-metrics {
      display: flex;
      align-items: center;
      
      .pave-metric {
        flex: 1;
        text-align: center;
        
        .metric-label {
          font-size: 14px;
          color: #909399;
          margin-bottom: 5px;
        }
        
        .metric-value {
          font-size: 18px;
          font-weight: bold;
        }
      }
      
      .pave-progress {
        flex: 2;
        
        .progress-item {
          margin-bottom: 15px;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          .progress-label {
            font-size: 14px;
            color: #909399;
            margin-bottom: 5px;
          }
          
          .progress-value {
            float: right;
            font-size: 14px;
            margin-left: 10px;
          }
          
          /deep/ .el-progress-bar {
            padding-right: 50px;
          }
        }
      }
    }
  }
  
  /* 快捷操作卡片 */
  .quick-actions-card {
    margin-bottom: 20px;
    
    .quick-actions {
      display: flex;
      justify-content: space-around;
      
      .el-button {
        flex: 1;
        margin: 0 10px;
        padding: 12px 0;
      }
    }
  }
  
  /* 最近项目卡片 */
  .recent-card {
    margin-bottom: 20px;
    
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 20px;
      
      .project-item {
        cursor: pointer;
        transition: all 0.3s;
        border-radius: 4px;
        overflow: hidden;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
        }
        
        .project-thumbnail {
          width: 100%;
          height: 120px;
        }
        
        .project-info {
          padding: 15px;
          
          .project-name {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .project-meta {
            font-size: 12px;
            color: #909399;
          }
        }
      }
    }
  }
  
  /* 铺装表格样式 */
  .pave-table {
    /deep/ .el-table__row.warning-row {
      background-color: #fdf6ec;
    }
    
    .pave-name {
      display: flex;
      align-items: center;
      margin: auto;
      
      .name-text {
        margin-right: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        align-items: center;
        margin: auto;
      }
    }
    
    .pave-location {
      .house-name {
        font-size: 12px;
        color: #909399;
        margin-top: 4px;
      }
    }
    
    .pave-stats {
      font-size: 13px;
      line-height: 1.6;
    }
    
    .loss-value {
      margin-top: 5px;
      text-align: center;
      font-size: 13px;
    }
  }
  
  /* 分页样式 */
  .pagination-wrapper {
    margin-top: 20px;
    text-align: center;
  }
  
  /* 卡片头部统一样式 */
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }






  
  #pave-stats-card {
    .stats-container {
        display: flex;
        height: calc(100% - 57px); // 减去头部高度
        
        .stats-data {
            flex: 2;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            padding-right: 20px;
            border-right: 1px solid #ebeef5;
            
            .stat-item {
                display: flex;
                align-items: center;
                padding: 8px 0;
                
                .stat-icon {
                    font-size: 24px;
                    margin-right: 15px;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    background: rgba(64, 158, 255, 0.1);
                    color: #409EFF;
                    
                    &[style*="color: #F56C6C"] {
                        background: rgba(245, 108, 108, 0.1);
                    }
                    &[style*="color: #67C23A"] {
                        background: rgba(103, 194, 58, 0.1);
                    }
                    &[style*="color: #E6A23C"] {
                        background: rgba(230, 162, 60, 0.1);
                    }
                }
                
                .stat-content {
                    .stat-value {
                        font-size: 20px;
                        font-weight: bold;
                        color: #303133;
                    }
                    
                    .stat-label {
                        font-size: 13px;
                        color: #909399;
                    }
                }
            }
        }
        
        .stats-gauge {
            flex: 3;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding-left: 20px;
            
            .gauge-title {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 10px;
                color: #606266;
            }
            
            .gauge-container {
                width: 100%;
                height: 220px;
            }
        }
    }
}
</style>
