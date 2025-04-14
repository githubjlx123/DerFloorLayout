<template>
    <div class="page-panel">
        <el-row :gutter="20">
            <el-col :span="8">
                <!-- 左侧用户信息卡片 -->
                <el-card shadow="hover" class="mgb20" style="height: 252px">
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
                    <div class="user-info-list">
                        最新登录地点：
                        <span>{{ user_local ? user_local : '未知' }}</span>
                    </div>
                </el-card>

                <!-- 左侧铺装方案训练卡片 -->
                <el-card shadow="hover" style="height: 252px" id="new-room-status">
                    <div slot="header" class="clearfix">
                        <span>
                            最新铺装方案模拟
                            <el-button style="float: right; margin-top: -5px" type="primary" icon="el-icon-refresh" @click="getNewRoomInfo"
                                >刷新</el-button
                            >
                        </span>
                    </div>
                    <h4>【铺装方案所属项目：{{ lastRoomMessage.project_name }}】</h4>
					<br>
                    <br />

                    地板利用率
                    <el-progress :percentage="lastRoomMessage.process" color="#42b983"></el-progress>
					<br>
                    地板损耗率
                    <el-progress :percentage="lastRoomMessage.loss" color="#f56c6c"></el-progress>

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
                                    <div>铺装区域数量</div>
                                </div>
                            </div>
                        </el-card>
                    </el-col>
                </el-row>

                <!-- 项目展示部分 -->
                <el-card shadow="hover" id="my-project">
                    <div class="list-header">
                        <div class="header-title">我的项目</div>
                        <el-button type="text" @click="goToPage('/projectAddPage')">【添加】 </el-button>
                        <el-button type="text" @click="goToPage('/projectListPage')">【查看更多】 </el-button> &nbsp;
                    </div>
                    <div>
                        <div class="list-panel" v-if="projects.length > 0">
                            <div class="project-item" v-for="project in projects" :key="project.id">
                                <div class="project-item-child" @click="checkProjectDetail(project.id)">
                                    <el-image class="table-td-thumb" :src="$serverUrl + project.image"></el-image>
                                    <p class="project-word" :title="project.name">{{ project.name | filterName }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="project-empty" v-else>
                            <el-empty description="暂无数据" :image-size="64"></el-empty>
                        </div>
                    </div>
                </el-card>

                <el-card shadow="hover" style="height: 190px; margin-top: 20px" isNotNeedRequestByHelp="true" id="my-data">
                    <div class="list-header">
                        <div class="header-title">我的户型</div>
                        <el-button type="text" @click="goToPage('/houseAddPage')">【添加】 </el-button>
                        <el-button type="text" @click="goToPage('/houseListPage')">【查看更多】 </el-button> &nbsp;
                    </div>
                    <div>
                        <div class="list-panel" v-if="houses.length > 0">
                            <div class="project-item" v-for="house in houses" :key="house.id">
                                <div class="project-item-child" @click="checkHouseDetail(house.id)">
                                    <el-image class="table-td-thumb" :src="$serverUrl + house.image"></el-image>
                                    <p class="project-word" :title="house.name">{{ house.name | filterName }}</p>
                                </div>
                            </div>
                        </div>
                        <div class="project-empty" v-else>
                            <el-empty description="暂无数据" :image-size="64"></el-empty>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-card shadow="hover">
                <div slot="header" class="clearfix" isNotNeedRequestByHelp="true" id="new-room-info">
                    <span>最新铺装方案信息</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="goToPage('/roomListPage')">【查看】 </el-button>
                    &nbsp;
                    <el-button style="float: right; padding: 3px 0" type="text" @click="goToPage('/roomTrainPage')">【添加】 </el-button>
                </div>

                <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                    <el-table-column prop="room_id" label="铺装方案ID" align="center"></el-table-column>

                    <el-table-column prop="room_name" label="铺装方案名称" align="center"></el-table-column>

                    <el-table-column prop="project_id" label="所属项目id" align="center"></el-table-column>

                    <el-table-column prop="project_name" label="所属项目名称" align="center"></el-table-column>

                    <el-table-column prop="train_cost" label="模拟时间" align="center"></el-table-column>

                    <el-table-column prop="epochs" label="铺装模拟结果" align="center"></el-table-column>

                    <el-table-column prop="status" label="铺装方案状态" align="center">
                        <div slot-scope="scope" v-if="scope.row.status == 'done'">
                            <el-tag type="success">训练完成</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.status == 'run'">
                            <el-tag type="normal"> 训练中...</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.status == 'break'">
                            <el-tag type="warning"> 训练终止</el-tag>
                        </div>
                        <div slot-scope="scope" v-else-if="scope.row.status =='error'">
                            <el-tag type="danger"> 训练异常</el-tag>
                        </div>
                    </el-table-column>

                    <el-table-column prop="accuracy" label="损耗率" align="center"></el-table-column>

                    <el-table-column label="详细" align="center">
                        <el-button
                            slot-scope="scope"
                            type="text"
                            icon="el-icon-search"
                            @click="checkRoomDetail(scope.$index, scope.row.room_id)"
                            >查看详细
                        </el-button>
                    </el-table-column>

                    <el-table-column label="操作" width="180" align="center">
                        <template slot-scope="scope">
                            <el-button
                                :disabled="scope.row.status === 3"
                                type="text"
                                icon="el-icon-edit"
                                @click="handleTest(scope.$index, scope.row)"
                            >
                                立即测试
                            </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red" @click="deleteRoomById(scope.row.room_id)"
                                >删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-card>
        </el-row>
        <HelpButton @click.native="showHomeInfoHelp(true)" ref="helpHomeRef"></HelpButton>
    </div>
</template>

<script>
import { deleteRoomById, getLastRoomsByUserId } from '@/api/RoomManage.js';
import { getSumByUserId, getLastProjectsByUserId, getLastHousesByUserId, getNewestRoomByUserId } from '@/api/UserHome.js';

import HelpButton from '@/components/common/mComponents/HelpButton.vue';
import { byteLength } from '@utils/common.js';
import EventBus from '@utils/bus.js';
import AnnotationCanvas from '@components/page/UserHouseManage/AnnotationCanvas.vue';

export default {
    name: 'dashboard',
    components: {
        HelpButton,
        // AnnotationCanvas,

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
            lastRoomMessage: {
                project_id: '',
                project_name: '暂无数据',
                process: 98,
                loss: 2,
                accuracy: 0
            } //最新铺装方案详情
        };
    },
    computed: {
        role() {
            return this.user_type === 'user' ? '普通用户' : '管理员';
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
        // this.getRoomList();
        // this.getNewRoomInfo();
    },
    mounted() {
        EventBus.$on('firstUseNavOver', this.showHomeInfoHelp); //导航引导结束,通知继续引导home详细面板
    },
    beforeDestroy() {
        EventBus.$off('firstUseNavOver');
    },
    methods: {
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
        //查询铺装方案列表
        getRoomList() {
            let params = {
                user_id: this.user_id
            };
            getLastRoomsByUserId(params)
                .then((res) => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.tableData = data;
                    } else {
                        this.$message.error(`查询最新铺装方案信息失败：${msg}！`);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询最新铺装方案信息失败!');
                });
        },
        //查询最新铺装方案信息
        getNewRoomInfo() {
            let params = {
                user_id: this.user_id
            };
            getNewestRoomByUserId(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        if (data.loss > 100) {
                            data.loss = 100;
                        }
                        for(let ele in data){
                            if(ele == 'project_name'){
                                this.lastRoomMessage[ele] = data[ele];
                            } else {
                                this.lastRoomMessage[ele] = parseFloat(data[ele]);
                            }
                        }
                    } else {
                        this.$message.error(`查询最新铺装方案信息失败:${msg}！`);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询最新铺装方案信息失败!');
                });
        },
        //点击铺装方案详情
        checkRoomDetail(index, train_id) {
            localStorage.setItem('ms_room_id', train_id);
            this.$router.push('/roomDetailPage');
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
</style>
