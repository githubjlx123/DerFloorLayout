<template>
    <div>
        <!-- 项目信息部分 -->
        <el-card shadow="hover" class="project-info">
            <div slot="header">
                <span>项目详细</span>
            </div>
            <div class="project-main">
                <div class="project-image">
                    <img class="image" :src="getImagePath(main_image)"/>
                </div>
            </div>
            <div class="project-message">
                <el-card shadow="hover">
                    <div slot="header" class="project-message-info">
                        <div class="info-title">项目信息</div>
                    </div>
                    <el-table :data="project" border class="project_table" header-cell-class-name="table-header">
                        <el-table-column prop="project_id" label="项目ID" align="center" width="100"></el-table-column>
                        <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                        <el-table-column label="项目类型" align="center" width="100">
                            <div slot-scope="scope" v-if="scope.row.mission == 1">
                                <el-tag type="normal">分类任务</el-tag>
                            </div>
                            <div slot-scope="scope" v-else-if="scope.row.mission == 2">
                                <el-tag type="danger"> 检测任务</el-tag>
                            </div>
                            <div slot-scope="scope" v-else-if="scope.row.mission == 3">
                                <el-tag type="success"> 分割任务</el-tag>
                            </div>
                        </el-table-column>
                        <el-table-column prop="create_date" label="创建时间" align="center"></el-table-column>
                        <el-table-column prop="username" label="创建人" align="center"></el-table-column>
                        <el-table-column prop="dataset_num" label="数据集数量" align="center" width="90"></el-table-column>
                        <el-table-column prop="model_num" label="模型数量" align="center" width="90"></el-table-column>
                        <el-table-column prop="deploy_num" label="部署数量" align="center" width="90"></el-table-column>
                    </el-table>
                    <el-table :data="tableProjectDetail" border class="project_table"
                              header-cell-class-name="table-header">
                        <el-table-column prop="detail" label="项目简介" align="center"
                                         style="height: 600px"></el-table-column>
                    </el-table>
                </el-card>
            </div>
        </el-card>
        <!-- 数据集信息部分 -->
        <el-card shadow="hover">
            <div slot="header" class="project-message-info">
                <div class="info-title">数据集信息</div>
                <el-button type="text" @click="moveToPage('admin_datasetList')">【更多】</el-button> &nbsp;
            </div>
            <div class="dataset-panel">
                <div class="dataset-main" v-for="dataset in datasetsData">
                    <div class="dataset-image" @click="checkDatasetDetail(dataset.id)">
                        <img :src="$serverUrl + dataset.image" width="90%"/>
                    </div>
                    <div class="user-info-name" align="center">名称：{{ dataset.name }}</div>
                    <div align="center">ID: {{ dataset.id }}</div>
                </div>
            </div>

            <el-pagination background layout="total, prev, pager, next" :current-page="DatasetPageIndex"
                           class="dataset-pagination" :page-size="DatasetPageSize" :total="DatasetPageTotal"
                           @current-change="handleDatasetPageChange"></el-pagination>
        </el-card>
        <!-- 模型信息部分 -->
        <el-card shadow="hover">
            <div slot="header" class="project-message-info">
                <div class="info-title">模型信息</div>
                <el-button type="text" @click="moveToPage('admin_modelList')">【更多】</el-button> &nbsp;
            </div>
            <el-table :data="modelsData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="model_id" label="模型ID" align="center"></el-table-column>

                <el-table-column prop="model_name" label="模型名称" align="center"></el-table-column>

                <el-table-column prop="dataset_id" label="数据集ID" align="center"></el-table-column>

                <el-table-column prop="dataset_name" label="数据集名称" align="center"></el-table-column>

                <el-table-column prop="create_time" label="开始时间" align="center"></el-table-column>

                <el-table-column prop="train_cost" label="训练时长" align="center"></el-table-column>

                <el-table-column prop="status" label="模型状态" align="center">
                    <div slot-scope="scope" v-if="scope.row.status == 1">
                        <el-tag type="success">训练完成</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 0">
                        <el-tag type="normal"> 训练中...</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 2">
                        <el-tag type="danger"> 已终止</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 3">
                        <el-tag type="danger"> 训练异常</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="accuracy" label="准确率" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                               :page-size="pageSize" :total="pageTotal"
                               @current-change="handleModelsPageChange"></el-pagination>
            </div>
        </el-card>
        <!-- 部署信息部分 -->
        <el-card shadow="hover">
            <div slot="header" class="project-message-info">
                <div class="info-title">部署信息</div>
                <el-button type="text" @click="moveToPage('admin_deployList')">【更多】</el-button> &nbsp;
            </div>

            <el-table :data="deployShowData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="deploy_id" label="部署ID" align="center" width="65"></el-table-column>

                <el-table-column prop="name" label="名称" align="center"></el-table-column>

                <el-table-column prop="create_date" label="部署时间" align="center"></el-table-column>

                <el-table-column prop="method" label="部署方式" align="center">
                    <div slot-scope="scope" v-if="scope.row.method == 1">
                        <el-tag type="success">本地部署</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.method == 2">
                        <el-tag type="normal">在线部署</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="path" label="部署路径" align="center"></el-table-column>

                <el-table-column prop="key" label="API_Key" align="center" width="150"></el-table-column>

                <el-table-column prop="goal" label="部署平台" align="center">
                    <div slot-scope="scope" v-if="scope.row.goal == 1">
                        <el-tag type="success">CPU平台</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.goal == 2">
                        <el-tag type="normal">GPU平台</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.goal == 0">
                        <el-tag type="danger">在线部署</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="count" label="调用次数" align="center" width="85"></el-table-column>

                <el-table-column prop="detail" label="说明" align="center"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="DeployPageIndex"
                               :page-size="DeployPageSize" :total="DeployPageTotal"
                               @current-change="handleDeployPageChange"></el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    import { getProjectDetail } from '@/api/ProjectManage';
    import { getDatasetsByProjectId } from '@/api/DatasetManage.js';
    import { getModelsByProjectId } from '@/api/ModelManage.js';
    import { adminGetModelDetailById } from '@/api/ModelManage.js';

    export default {
        name: 'projectDetail',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),//管理员ID
                project_id: localStorage.getItem('ms_project_id'),//项目ID
                project: [],//项目详细信息
                tableProjectDetail: [
                    {
                        detail: '该项目暂无介绍'
                    }
                ],
                main_image: '',//项目图片
                //数据集表格
                datasetsData: [],//数据集原始表格
                datasetsShowData: [],//数据集展示表格
                DatasetPageIndex: 1,//数据集分页页码
                DatasetPageSize: 5,//数据集页大小
                DatasetPageTotal: 0,//数据集总条数
                //模型表格
                modelsData: [],//模型原始表格
                modelsShowData: [],//模型展示表格
                pageIndex: 1,//模型分页页码
                pageSize: 5,//模型页大小
                pageTotal: 0,//模型总条数
                //部署表格
                deployData: [],//部署原始表格
                deployShowData: [],//部署展示表格
                DeployPageIndex: 1,//部署分页页码
                DeployPageSize: 5,//部署页大小
                DeployPageTotal: 0//部署总数
            };
        },
        mounted() {
            this.getData();
            this.getDatasetsList();
            this.getModelList();
        },
        methods: {
            // 获取图片路径
            getImagePath(image_name) {
                return this.$serverUrl + image_name;
            },
            //获取data
            getData() {
                let params = {
                    admin_id: this.user_id,
                    project_id: this.project_id
                };
                getProjectDetail(params).then((res) => {
                    let { data } = res;
                    data.project['username'] = data.user.username;
                    this.main_image = data.project.image;
                    /* this.modelsShowData = data.models;
                     this.deployShowData = data.deploys;*/
                    this.$set(this.project, 0, data.project);
                    this.$set(this.tableProjectDetail[0], 'detail', data.project.detail !== '' ? data.project.detail : this.tableProjectDetail.detail);
                    // 数据集部分
                    /*  this.datasetsData = data.datasets;
                      this.DatasetPageTotal = this.datasetsData.length;
                      this.handleDatasetPageChange(1);*/
                    // 模型部分
                    /* this.modelsData = data.models;
                     this.pageTotal = this.modelsData.length;
                     this.handleModelsPageChange(1);*/
                    //部署部分
                    this.deployData = data.deploys;
                    this.DeployPageTotal = this.deployData.length;
                    this.handleDeployPageChange(1);
                })
                    .catch((error) => {
                        this.$message.error('获取数据失败!');
                    });
            },
            //查询数据集列表
            getDatasetsList() {
                let params = {
                    user_id: this.user_id,
                    project_id: this.project_id,
                    page_index: this.DatasetPageIndex,
                    page_size: this.DatasetPageSize
                };
                getDatasetsByProjectId(params).then(res => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.datasetsData = data;
                        this.DatasetPageTotal = total;
                    } else {
                        this.datasetsData = [];
                        this.$message.error(`查询数据集列表失败：${msg}！`);
                    }
                }).catch(error => {
                    this.datasetsData = [];
                    this.$message.error('查询数据集列表失败!');
                });
            },
            //查询模型列表
            getModelList() {
                let params = {
                    user_id: this.user_id,
                    project_id: this.project_id,
                    page_index: this.pageIndex,
                    page_size: this.pageSize
                };
                getModelsByProjectId(params).then(res => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.modelsData = data;
                        this.pageTotal = total;
                    } else {
                        this.modelsData = [];
                        this.$message.error(`查询模型列表失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询模型列表失败!');
                });
            },
            //查看数据集详情
            checkDatasetDetail(dataset_id) {
                localStorage.setItem('ms_dataset_id', dataset_id);
                this.$router.push('/admin_datasetDetail');
            },
            //查看更多部署信息
            moveToPage(router) {
                this.$router.push(`/${router}`);
            },
            //前端分页
            getShowData(pageIndex = 1, pageSize, originalDataName, showDataName) {
                this[showDataName] = [];
                let begin = (this.pageIndex - 1) * pageSize;
                for (let i = begin; i < this[originalDataName].length && i < pageIndex * pageSize; i++) {
                    this[showDataName].push(this[originalDataName][i]);
                }
            },
            //点击数据集分页
            handleDatasetPageChange(val) {
                this.DatasetPageIndex = val;
                this.getDatasetsList();
            },
            //点击模型分页
            handleModelsPageChange(val) {
                this.pageIndex = val;
                this.getModelList();
            },
            //点击部署分页
            handleDeployPageChange(val) {
                this.DeployPageIndex = val;
                this.getShowData(this.DeployPageIndex, this.DeployPageSize, 'deployData', 'deployShowData');
            }
        }
    };
</script>

<style scoped lang="less">
    .project-info {
        height: 350px;
    }

    .project-main {
        float: left;
        width: 250px;
        height: 250px;
        border: 1px dashed gray;
    }

    .project-image {
        text-align: center;
        margin: 10px;

        .image {
            width: 220px;
            height: 220px;
        }
    }

    .project_table {
        width: 100%;
    }

    .project-message {
        margin-left: 8px;
        width: 100%;
    }

    .project-message-info {
        display: flex;
    }

    .info-title {
        flex: 1;
    }

    .dataset-panel {
        display: flex;
    }

    .dataset-main {
        text-align: center;
        border: 1px dashed gray;
        width: 18%;
        margin: 10px;
        padding-bottom: 6px;
    }

    .dataset-pagination {
        text-align: right;
    }

    .dataset-image {
        cursor: pointer;
        text-align: center;
        width: 98%;
        margin: 10px 2%;
    }
</style>
