<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 铺装管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>铺装详细信息</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!-- 顶部信息卡片 -->
            <el-card shadow="hover" class="header-card optimized-header">
                <div class="header-content">
                    <!-- 标题区域 -->
                    <div class="title-section">
                    <div class="title-main">
                        <i class="el-icon-document title-icon"></i>
                        <h2 class="detail-title">{{ planInfo.plan_name || '未命名方案' }}</h2>
                    </div>
                    <div class="title-meta">
                        <el-tag :type="planInfo.status == 1 ? 'success' : 'info'" effect="dark" size="medium">
                        {{ planInfo.status == 1 ? '有效方案' : '已失效' }}
                        </el-tag>
                        <span class="create-time">
                        <i class="el-icon-time"></i> {{ planInfo.create_time }}
                        </span>
                    </div>
                    </div>

                    <!-- 关键信息区域 -->
                    <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">
                        <i class="el-icon-office-building"></i> 所属项目
                        </div>
                        <div class="info-value">{{ planInfo.project_name }}</div>
                    </div>
                    
                    <div class="info-item">
                        <div class="info-label">
                        <i class="el-icon-house"></i> 所属户型
                        </div>
                        <div class="info-value">{{ planInfo.house_name }}</div>
                    </div>
                    
                    <div class="info-item highlight">
                        <div class="info-label">
                        <i class="el-icon-set-up"></i> 铺装方法
                        </div>
                        <div class="info-value">
                        <el-tag :color="getMethodColor(planInfo.pave_method)" effect="dark">
                            {{ getMethodName(planInfo.pave_method) }}
                        </el-tag>
                        </div>
                    </div>
                    
                    <div class="info-item highlight">
                        <div class="info-label">
                        <i class="el-icon-magic-stick"></i> 优化策略
                        </div>
                        <div class="info-value">
                        <el-tag :color="getOptimizerColor(planInfo.pave_optimizer)" effect="dark">
                            {{ getOptimizerName(planInfo.pave_optimizer) }}
                        </el-tag>
                        </div>
                    </div>
                    
                    <div class="info-item highlight">
                        <div class="info-label">
                        <i class="el-icon-crop"></i> 地板规格
                        </div>
                        <div class="info-value">
                        <el-tag color="#FFBD47" effect="dark">
                            {{ planInfo.floor_width }} × {{ planInfo.floor_height }} mm
                        </el-tag>
                        </div>
                    </div>
                    </div>
                </div>
            </el-card>

            <!-- 主要信息区域 -->
            <div class="main-content">
                <!-- 左侧统计信息 -->
                <div class="left-panel">
                    <el-card shadow="hover" class="stat-card">
                        <div slot="header" class="clearfix">
                            <span>铺装统计</span>
                        </div>
                        <div class="stat-grid">

                            <div class="stat-item">
                                <div class="stat-label">房间总面积</div>
                                <div class="stat-value">{{ (planInfo.total_area / 1000000).toFixed(2) }}㎡</div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-label">地板总面积</div>
                                <div class="stat-value">{{ (planInfo.floor_area / 1000000).toFixed(2) }}㎡</div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-label">踢脚线总长</div>
                                <div class="stat-value">{{ (planInfo.total_length / 1000).toFixed(2) }}m</div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-label">整铺地板数</div>
                                <div class="stat-value">{{ formatNumber(planInfo.fully_floor_num) }}块</div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-label">地板总数</div>
                                <div class="stat-value">{{ formatNumber(planInfo.floor_count) }}块</div>
                            </div>

                            <div class="stat-item">
                                <div class="stat-label">裁剪地板数</div>
                                <div class="stat-value">{{ formatNumber(planInfo.partly_floor_num) }}块</div>
                            </div>
                            
                            <div class="stat-item highlight">
                                <div class="stat-label">铺装损耗率</div>
                                <div class="stat-value">{{ planInfo.pave_loss }}</div>
                            </div>
                        </div>
                    </el-card>

                    <!-- 损耗率图表 -->
                    <el-card shadow="hover" class="chart-card">
                        <div slot="header" class="clearfix">
                            <span>损耗率分析</span>
                        </div>
                        <div class="LossChart" ref="lossChart"></div>
                    </el-card>
                </div>

                <!-- 右侧房间详情 -->
                <div class="right-panel">
                    <el-card shadow="hover" class="room-card">
                        <div slot="header" class="clearfix">
                            <span>房间铺装详情</span>
                            <el-button 
                                style="float: right; padding: 3px 0" 
                                type="text"
                                @click="exportPaveData"
                            >导出数据</el-button>
                        </div>
                        
                        <el-tabs v-model="activeRoomTab" type="card">
                            <el-tab-pane 
                                v-for="(room, index) in roomList" 
                                :key="room.room_id" 
                                :label="room.room_name" 
                                :name="room.room_id"
                            >
                                <div class="room-detail">
                                    <div class="room-image">
                                        <el-image 
                                            :src="getRoomImagePath(room)" 
                                            :preview-src-list="[getRoomImagePath(room)]"
                                            fit="contain"
                                        ></el-image>
                                    </div>
                                    <div class="room-info">
                                        <el-descriptions :column="1" border :contentStyle="content_style" :labelStyle="label_style" style="margin: auto;">
                                            <el-descriptions-item label="房间ID">{{ room.room_id }}</el-descriptions-item>
                                            <el-descriptions-item label="铺装起点">({{ room.start_x }}, {{ room.start_y }})</el-descriptions-item>
                                            <el-descriptions-item label="铺装方向">
                                                {{ getDirectionName(room.start_dir) }}
                                            </el-descriptions-item>

                                            <el-descriptions-item label="地板数量">
                                                {{ (room.pave_floor_fully_inside_tiles.length + room.pave_floor_partly_inside_tiles.length) || 0}} 片
                                            </el-descriptions-item>

                                            <el-descriptions-item label="整铺地板">
                                                {{ room.pave_floor_fully_inside_tiles.length || 0 }} 片
                                            </el-descriptions-item>

                                            <el-descriptions-item label="裁剪地板">
                                               {{ room.pave_floor_partly_inside_tiles.length || 0 }} 片
                                            </el-descriptions-item>

                                            <el-descriptions-item label="地板面积" style="height: 400px;">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>

                                            <el-descriptions-item label="房间踢脚线">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>

                                            <el-descriptions-item label="房间信息1">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>

                                            <el-descriptions-item label="房间信息2">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>

                                            <el-descriptions-item label="房间信息3">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>


                                            <el-descriptions-item label="房间信息4">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>


                                            <el-descriptions-item label="房间信息5">
                                                <!-- {{ formatNumber(room.floor_area || 0) }}m㎡ -->
                                                【待完善】
                                            </el-descriptions-item>

                                        </el-descriptions>
                                    </div>
                                </div>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </div>
            </div>

            <!-- 在UserPaveDetail.vue中添加 -->
            <el-card shadow="hover" class="chart-card">
                <div slot="header" class="clearfix">
                    <span>铺装流程示意图（临时展示效果，非对应户型，功能待完善）</span>
                    <el-tag type="warning" style="float: right;">测试效果演示</el-tag>
                </div>
                
                <div class="pave-process-carousel">
                    <!-- 主展示区 -->
                    <div class="carousel-main">
                        <el-image 
                            :src="currentStepImage" 
                            :preview-src-list="stepImages"
                            fit="contain"
                            class="main-image"
                        >
                            <div slot="placeholder" class="image-loading" v-if="isImageLoading">
                                <i class="el-icon-loading"></i>
                                <span>加载中...</span>
                            </div>
                            <div slot="error" class="image-error">
                                <i class="el-icon-picture-outline"></i>
                                <span>图片加载失败</span>
                            </div>
                        </el-image>
                        
                        <!-- 序号指示器 -->
                        <div class="step-indicator">
                            {{ currentStep + 1 }} / {{ totalSteps }}
                        </div>
                    </div>
                    
                    <!-- 控制区 -->
                    <div class="carousel-controls">
                        <el-button 
                            circle 
                            icon="el-icon-arrow-left" 
                            @click="prevStep"
                            :disabled="currentStep === 0"
                        ></el-button>
                        
                        <!-- 缩略图列表 -->
                        <div class="thumbnails-container">
                            <div 
                                v-for="(img, index) in visibleThumbnails" 
                                :key="index"
                                class="thumbnail-wrapper"
                                :class="{ active: (startThumbIndex + index) === currentStep }"
                                @click="goToStep(startThumbIndex + index)"
                            >
                                <el-image 
                                    :src="img" 
                                    fit="cover"
                                    class="thumbnail"
                                >
                                    <div slot="error" class="thumbnail-error">
                                        {{ index + 1 }}
                                    </div>
                                </el-image>
                            </div>
                        </div>
                        
                        <el-button 
                            circle 
                            icon="el-icon-arrow-right" 
                            @click="nextStep"
                            :disabled="currentStep === totalSteps - 1"
                        ></el-button>
                    </div>
                    
                    <!-- 自动播放控制 -->
                    <div class="auto-play-control">
                        <el-switch
                            v-model="autoPlay"
                            active-text="自动播放"
                            inactive-text="手动切换"
                            @change="toggleAutoPlay"
                        ></el-switch>
                        <el-slider
                            v-model="playSpeed"
                            :min="1"
                            :max="5"
                            :step="1"
                            :marks="speedMarks"
                            style="width: 200px; margin-left: 20px;"
                            @change="changePlaySpeed"
                        ></el-slider>

                        <div class="page-jumper">
                        <span>跳至：</span>
                        <el-input-number
                            v-model="jumpPage"
                            :min="1"
                            :max="totalSteps"
                            size="small"
                            @change="handlePageJump"
                            style="width: 140px;"
                        ></el-input-number>
                        <span>步</span>
                    </div>
                    </div>                    
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
import { getPavePlanById } from '@/api/PaveManage.js';
import { getImageByPath } from '@/api/HouseManage.js';



import * as echarts from 'echarts';

export default {
    name: 'pavePaveDetail',
    data() {
        return {
            user_id: localStorage.getItem('ms_user_id'),
            pave_id: localStorage.getItem('ms_pave_id'),
            pave_id: this.$route.query.pave_id || localStorage.getItem('ms_pave_id'),
            planInfo: {},
            roomList: [],
            activeRoomTab: '',
            lossChart: null,


            // 铺装步骤相关数据
            currentStep: 0,
            totalSteps: 86,
            autoPlay: false,
            playSpeed: 3, // 1-5档速度
            playInterval: null,
            startThumbIndex: 0, // 当前显示的缩略图起始索引
            visibleThumbCount: 10, // 可见缩略图数量
            
            speedMarks: {
                1: '慢',
                3: '中',
                5: '快'
            },

            stepImages: [],

            // 新增数据
            jumpPage: 1,
            isImageLoading: false,

            content_style: {
                // 居中
                'text-align': 'center',
                // 解决不对齐的问题
                // 'width':"15px",
                'height': "50px",
                // 排列第二行
                'word-break': 'break-all'
            },
            label_style: {
                // 居中
                'text-align': 'center',
                // 解决不对齐的问题
                'width':"100px",
                // 排列第二行
                'word-break': 'break-all'
            }
        };
    },
    created() {
        this.getPavePlanInfo();
        this.getStepImages();
    },
    computed: {

        
        // 当前步骤图片
        currentStepImage() {
            return this.stepImages[this.currentStep];
        },
        
        // 可见的缩略图
        visibleThumbnails() {
            const endIndex = Math.min(
                this.startThumbIndex + this.visibleThumbCount, 
                this.totalSteps
            );
            return this.stepImages.slice(this.startThumbIndex, endIndex);
        }
    },
    beforeDestroy() {
        if (this.lossChart) {
            this.lossChart.dispose();
        }
    },
    methods: {
        // 初始化时预加载所有图片
        preloadImages() {
            this.stepImages.forEach(imgSrc => {
                const img = new Image();
                img.src = imgSrc;
            });
        },
        // 生成步骤图片路径
        getStepImages() {
            this.stepImages = Array.from({ length: this.totalSteps }, (_, i) => 
                `${this.$serverUrl}static/pave/1001/step/step_${i + 1}.png`
            );
            this.preloadImages();
        },
        // 数字格式修改
        formatNumberWithCommas(cellValue) {
            // 处理可能的 null 或 undefined 值
            if (cellValue == null) return '';
            
            // 将数字转换为字符串并添加千位分隔符
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
            // return Number(cellValue).toLocaleString('en-US');
        },
        // 获取铺装方案信息
        getPavePlanInfo() {
            let params = {
                user_id: this.user_id,
                pave_id: this.pave_id
            };
            
            const loading = this.$loading({
                lock: true,
                text: '加载铺装信息中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            
            getPavePlanById(params).then(res => {
                let { data, status, msg } = res;
                if (status == 200) {
                    this.planInfo = data;
                    this.roomList = data.room_list || [];

                    if (this.roomList.length > 0) {
                        this.activeRoomTab = this.roomList[0].room_id;
                    }

                    this.$nextTick(() => {
                        this.initLossChart();
                    });
                } else {
                    this.$message.error(`查询铺装信息失败:${msg}！`);
                }
            }).catch(error => {
                this.$message.error('查询铺装信息失败!');
            }).finally(() => {
                loading.close();
            });
        },
        
        // 初始化损耗率图表
        initLossChart() {
            if (!this.planInfo.pave_loss) return;
            
            const chartDom = this.$refs.lossChart;
            if (!chartDom) return;
            
            this.lossChart = echarts.init(chartDom);
            
            const lossValue = parseFloat(this.planInfo.pave_loss);
            const option = {
                tooltip: {
                    formatter: '{a} <br/>{b} : {c}%'
                },
                series: [{
                    name: '铺装损耗率',
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
        
        // 获取铺装方法名称
        getMethodName(method) {
            const methods = {
                '369': '步步高铺装(369)',
                '2468': '四分步步高铺装(2468)',
                'I': '工字铺装',
                'H': '人字铺装',
                'F': '鱼骨铺装'
            };
            return methods[method] || method;
        },
        
        // 获取优化策略名称
        getOptimizerName(optimizer) {
            const optimizers = {
                '1': '最大贪婪优化',
                '2': '贪婪优化',
                '3': '动态规划优化',
                '4': '无优化'
            };
            return optimizers[optimizer] || optimizer;
        },
        
        // 获取铺装方向名称
        getDirectionName(dir) {
            const directions = {
                '1': '右上(↗)',
                '2': '左上(↖)',
                '3': '左下(↙)',
                '4': '右下(↘)'
            };
            return directions[dir] || dir;
        },

        // 获取铺装方法对应的颜色
        getMethodColor(method) {
            const colors = {
            '369': '#409EFF',
            '2468': '#67C23A',
            'I': '#E6A23C',
            'H': '#F56C6C',
            'F': '#909399'
            };
            return colors[method] || '#409EFF';
        },
    
        // 获取优化策略对应的颜色
        getOptimizerColor(optimizer) {
            const colors = {
            '1': '#67C23A',
            '2': '#E6A23C',
            '3': '#F56C6C',
            '4': '#909399'
            };
            return colors[optimizer] || '#409EFF';
        },
        
        // 格式化数字显示
        formatNumber(num) {
            if (num === undefined || num === null) return '0';
            return this.formatNumberWithCommas(num);
        },
        
        // 获取房间图片路径
        getRoomImagePath(room) {
            // if (!room || !room.image_path) return '';
            // console.log("PATH IS : " + this.$serverUrl + room.image_path)
            return this.$serverUrl + room.image_path;
        },
        
        // 导出铺装数据
        exportPaveData() {
            this.$message.info('导出功能开发中...');
            // 实际项目中这里可以调用导出API或生成Excel文件
        },
        

        // 上一步
        prevStep() {
            if (this.currentStep > 0) {
                this.currentStep--;
                this.adjustThumbnails();
            }
        },
        
        // 下一步
        nextStep() {
            if (this.currentStep < this.totalSteps - 1) {
                this.currentStep++;
                this.adjustThumbnails();
            }
        },
        
        // 修改图片切换方法
        goToStep(index) {
            // 先显示加载状态
            this.isImageLoading = true;
            this.currentStep = index;
            this.adjustThumbnails();
            
            // 设置一个小延迟确保DOM更新
            this.$nextTick(() => {
                this.isImageLoading = false;
            });
        },
        
        // 调整缩略图显示范围
        adjustThumbnails() {
            // 如果当前步骤不在可见范围内，调整缩略图起始位置
            if (this.currentStep < this.startThumbIndex) {
                this.startThumbIndex = this.currentStep;
            } else if (this.currentStep >= this.startThumbIndex + this.visibleThumbCount) {
                this.startThumbIndex = this.currentStep - this.visibleThumbCount + 1;
            }
        },
        
        // 切换自动播放
        toggleAutoPlay() {
            if (this.autoPlay) {
                this.startAutoPlay();
            } else {
                this.stopAutoPlay();
            }
        },
        
        // 开始自动播放
        startAutoPlay() {
            this.stopAutoPlay();
            const interval = 2000 - (this.playSpeed - 1) * 300; // 速度越快间隔越短
            this.playInterval = setInterval(() => {
                if (this.currentStep < this.totalSteps - 1) {
                    this.nextStep();
                } else {
                    this.stopAutoPlay();
                }
            }, interval);
        },
        
        // 停止自动播放
        stopAutoPlay() {
            if (this.playInterval) {
                clearInterval(this.playInterval);
                this.playInterval = null;
            }
        },
        
        // 改变播放速度
        changePlaySpeed() {
            if (this.autoPlay) {
                this.startAutoPlay();
            }
        },

        // 页码跳转处理
        handlePageJump(val) {
            this.goToStep(val - 1);
        },
        
        // 修改currentStep的watch
        watch: {
            currentStep(newVal) {
                this.jumpPage = newVal + 1;
            }
        }
    },
    mounted() {
        // 初始化缩略图位置
        this.adjustThumbnails();
    },
    beforeDestroy() {
        this.stopAutoPlay();
    }
};
</script>

<style scoped lang="less">
.detail-title {
    font-size: 18px;
    font-weight: bold;
}

.header-card {
    margin-bottom: 20px;
    
    /deep/ .el-descriptions__body {
        background-color: #fafafa;
    }
}

.main-content {
    display: flex;
    gap: 20px;
}

.left-panel {
    flex: 1;
    min-width: 400px;
}

.right-panel {
    flex: 2;
    min-width: 600px;
}

.stat-card {
    margin-bottom: 20px;
    
    .stat-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 16px;
    }
    
    .stat-item {
        padding: 12px;
        border-radius: 4px;
        background-color: #f8f8f8;
        text-align: center;
        
        &.highlight {
            grid-column: span 2;
            background-color: #f0f9eb;
            border: 1px solid #e1f3d8;
        }
    }
    
    .stat-label {
        font-size: 14px;
        color: #909399;
        margin-bottom: 8px;
    }
    
    .stat-value {
        font-size: 18px;
        font-weight: bold;
        color: #303133;
    }
}

.chart-card {
    .LossChart {
        width: 100%;
        height: 300px;
    }
}

.room-card {
    .room-detail {
        display: flex;
        gap: 20px;
        height: 710px; /* 设置固定高度 */
    }
    
    .room-image {
        flex: 75;
        height: 100%; /* 继承父容器高度 */
        border: 1px solid #ebeef5;
        display: flex;
        align-items: flex-start; /* 改为flex-start以便可以滚动 */
        justify-content: center;
        background-color: #f5f7fa;
        overflow-y: auto; /* 启用垂直滚动 */
        
        /deep/ .el-image {
            max-height: none; /* 移除最大高度限制 */
            width: 100%;
            height: auto; /* 保持原始高度 */
        }
    }
    
    .room-info {
        flex: 25;
    
        height: 100%; /* 继承父容器高度 */
        overflow-y: auto; /* 如果需要也可以滚动 */

        ::v-deep(.el-descriptions__cell) {
            height: 48px;
            line-height: 48px;
        }

        ::v-deep(.el-descriptions__label),
        ::v-deep(.el-descriptions__content) {
            font-size: 14px;
            padding: 8px 12px;
        }
    }

    /* 自定义滚动条样式 */
    .room-image::-webkit-scrollbar {
        width: 8px;
    }
    .room-image::-webkit-scrollbar-track {
        background: #f1f1f1;
    }
    .room-image::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 4px;
    }
    .room-image::-webkit-scrollbar-thumb:hover {
        background: #a8a8a8;
    }
}

@media (max-width: 1200px) {
    .main-content {
        flex-direction: column;
    }
    
    .left-panel, .right-panel {
        min-width: auto;
    }
    
    .room-detail {
        flex-direction: column;
    }
}


.optimized-header {
  /deep/ .el-card__body {
    padding: 20px;
  }

  .header-content {
    .title-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;

      .title-main {

        width: 800px;
        display: flex;
        align-items: center;

        .title-icon {
          font-size: 24px;
          color: #409EFF;
          margin-right: 10px;
        }

        .detail-title {
          font-size: 22px;
          font-weight: 600;
          color: #303133;
          margin: 0;
        }
      }

      .title-meta {
        display: flex;
        align-items: center;

        .create-time {
          margin-left: 15px;
          font-size: 14px;
          color: #909399;
          display: flex;
          align-items: center;

          i {
            margin-right: 5px;
          }
        }
      }
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 16px;

      .info-item {
        padding: 12px 15px;
        background: #f8fafc;
        border-radius: 4px;
        transition: all 0.3s;

        &.highlight {
          background: #f0f9ff;
          border-left: 3px solid #409EFF;
        }

        &:hover {
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        .info-label {
          font-size: 13px;
          color: #909399;
          margin-bottom: 8px;
          display: flex;
          align-items: center;

          i {
            margin-right: 6px;
            font-size: 16px;
          }
        }

        .info-value {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
          word-break: break-all;
        }
      }
    }
  }
}






// 自动播放部分

.pave-process-carousel {
    padding: 10px;
    justify-content: center;
    align-items: center;
    
    .carousel-main {
        position: relative;
        height: 800px;
        width: 800px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #f5f7fa;
        border-radius: 4px;
        margin-bottom: 15px;
        overflow: hidden;
        margin: auto;
        
        .main-image {
            max-width: 100%;
            max-height: 100%;
            display: block;
        }
        
        .step-indicator {
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.6);
            color: white;
            padding: 5px 10px;
            border-radius: 12px;
            font-size: 12px;
        }
        
        .image-error {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #909399;
            
            i {
                font-size: 40px;
                margin-bottom: 10px;
            }
        }
    }
    
    .carousel-controls {
        display: flex;
        align-items: center;
        justify-content: space-between; // 修改为space-between
        margin-bottom: 15px;
        flex-wrap: wrap;
        
        .control-group {
            display: flex;
            align-items: center;
        }
        
        .el-button {
            margin: 0 10px;
        }
        
        .thumbnails-container {
            display: flex;
            overflow-x: auto;
            padding: 5px 0;
            flex: 1;
            
            &::-webkit-scrollbar {
                height: 4px;
            }
            
            &::-webkit-scrollbar-thumb {
                background: #c0c4cc;
                border-radius: 2px;
            }
        }
        
        .thumbnail-wrapper {
            width: 120px;
            height: 80px;
            margin: 0 10px;
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 2px;
            transition: all 0.3s;
            flex-shrink: 0;
            
            &.active {
                border-color: #409EFF;
                transform: scale(1.1);
            }
            
            &:hover:not(.active) {
                border-color: #dcdfe6;
            }
            
            .thumbnail {
                width: 100%;
                height: 100%;
            }
            
            .thumbnail-error {
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                background: #f5f7fa;
                color: #909399;
                font-size: 12px;
            }
        }
    }
    
    .auto-play-control {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 10px;
        border-top: 1px solid #ebeef5;
    }
}

// @media (max-width: 768px) {
//     .pave-process-carousel {
//         .carousel-main {
//             height: 300px;
//         }
        
//         .carousel-controls {
//             .thumbnail-wrapper {
//                 width: 40px;
//                 height: 30px;
//             }
//         }
//     }
// }

.image-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #409EFF;
    
    i {
        font-size: 40px;
        margin-bottom: 10px;
        animation: rotating 2s linear infinite;
    }
    
    @keyframes rotating {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
}

.page-jumper {
    display: flex;
    align-items: center;
    margin-left: 20px;
    font-size: 14px;
    
    span {
        margin: 0 5px;
        color: #606266;
    }
    
    .el-input-number {
        width: 80px;
        
        /deep/ .el-input__inner {
            text-align: center;
        }
    }
}

</style>