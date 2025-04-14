<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 项目管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>项目详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <!-- 项目信息部分 -->
        <el-card shadow="hover" class="project-detail">
            <div slot="header" class="clearfix">
                <span>项目详细</span>
            </div>
            <div class="detail-info">
                <div class="project-main">
                    <img class="project-main-img" :src="getImagePath(main_image)"/>
                </div>
                <div class="project-message">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>项目信息</span>
                        </div>
                        <el-table :data="project" border class="table" header-cell-class-name="table-header"
                                  style="width: 100%;">
                            <el-table-column prop="id" label="项目ID" align="center"></el-table-column>
                            <el-table-column prop="name" label="项目名称" align="center"></el-table-column>
                            <el-table-column prop="mission" label="项目类型" align="center">
                                <div slot-scope="scope" v-if="scope.row.mission == 1">
                                    <el-tag type="normal"> 常规铺装项目</el-tag>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.mission == 2">
                                    <el-tag type="danger"> 整体铺装项目</el-tag>
                                </div>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
                            <el-table-column prop="update_time" label="修改时间" align="center"></el-table-column>
                            <el-table-column label="户型数量" align="center">
                                <template>
                                    <div>{{housePageTotal}}</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="模型数量" align="center">
                                <template>
                                    <div>{{modelPageTotal}}</div>
                                </template>
                            </el-table-column>
                        </el-table>
                        <el-table :data="project" border class="table"
                                  header-cell-class-name="table-header" style="width: 100%;">
                            <el-table-column prop="detail" label="项目简介" align="center" style="height: 600px;">
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </div>

        </el-card>

        <!-- 户型信息部分 -->
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>户型信息</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleMoveTo('/houseListPage')">
                    【更多】
                </el-button>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleAddHouse">
                    【添加】
                </el-button>
            </div>
            <div class="house-contain">
                <div class="house-main" v-for="house in housesData" :key="house.id">
                    <div class="house-image" @click="checkHouseDetail(house.id)">
                        <img class="image-list" :src="$serverUrl + house.image"/>
                    </div>
                    <div class="img-info">
                        <div>
                            <div class="img-info-title">名称：{{house.name}}</div>
                            <div class="img-info-title">编号：{{house.id}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="housePageIndex"
                               :page-size="housePageSize" :total="housePageTotal"
                               @current-change="handleHousePageChange">
                </el-pagination>
            </div>

        </el-card>

        <!-- 模型信息部分 -->
        <el-card shadow="hover">
            <div slot="header" class="clearfix">
                <span>模型信息</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleMoveTo('/modelListPage')">
                    【更多】
                </el-button>
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="handleMoveToTrain('/modelTrainPage')">
                    【训练】
                </el-button>
            </div>
            <el-table :data="modelsData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">

                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{(modelPageIndex - 1)*modelPageSize + scope.$index + 1}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="model_id" label="模型ID" align="center"></el-table-column>

                <el-table-column prop="model_name" label="模型名称" align="center"></el-table-column>

                <el-table-column prop="house_id" label="户型ID" align="center"></el-table-column>

                <el-table-column prop="house_name" label="户型名称" align="center"></el-table-column>

                <el-table-column prop="train_cost" label="训练时长" align="center"></el-table-column>

                <el-table-column label="模型状态" align="center">
                    <div slot-scope="scope" v-if="scope.row.status == 'done'">
                        <el-tag type="success">训练完成</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 'run'">
                        <el-tag type="normal"> 训练中...</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 'break'">
                        <el-tag type="warning"> 已终止</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == 'error'">
                        <el-tag type="danger"> 训练异常</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="accuracy" label="准确率" align="center">
                    <template slot-scope="scope">
                        {{(scope.row.accuracy * 100).toFixed(2)}}%
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button  type="text" icon="el-icon-edit" @click="toTestModel(scope.row)">
                            立即测试
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="modelPageIndex"
                               :page-size="modelPageSize" :total="modelPageTotal" @current-change="handleModelPageChange">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
    // import { deleteModelById, getModelsByProjectId } from '@/api/ModelManage.js';
    import { getProjectById } from '@/api/ProjectManage.js';
    import { getHousesByProjectId } from '@/api/HouseManage.js';

    export default {
        name: 'houseForm',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                project_id: localStorage.getItem('ms_project_id'),
                project: [],//项目详情
                housesData: [],//户型列表
                modelsData: [],//模型列表
                modelPageSize: 5,
                modelPageIndex: 1,
                modelPageTotal: 0,
                main_image: '',//项目图片
                housePageIndex: 1,//户型页码
                housePageSize: 6,//户型页大小
                housePageTotal: 0,//户型总条数
            };
        },
        created() {
            this.getProjectDetail();
            this.getHousesList();
            this.getModelList();
        },
        methods: {
            //图片地址
            getImagePath(image_name) {
                return (this.$serverUrl + image_name);
            },
            //查询项目详情
            getProjectDetail() {
                let params = {
                    user_id: this.user_id,
                    project_id: this.project_id
                };
                getProjectById(params).then(res => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.project = [];//先清空
                        this.project.push(data);//先清空
                        this.main_image = data.image;//项目图片
                    } else {
                        this.$message.error(`查询项目详情失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询项目详情失败!');
                });
            },
            //查询户型列表
            getHousesList() {
                let params = {
                    user_id: this.user_id,
                    project_id: this.project_id,
                    page_index: this.housePageIndex,
                    page_size: this.housePageSize
                };
                getHousesByProjectId(params).then(res => {
                    let { data, status, msg ,total} = res;
                    if (status == 200) {
                        this.housesData = data;
                        this.housePageTotal = total;
                    } else {
                        this.housesData = [];
                        this.$message.error(`查询户型列表失败：${msg}！`);
                    }
                }).catch(error => {
                    this.housesData = [];
                    this.$message.error('查询户型列表失败!');
                });
            },
            //查询模型列表
            getModelList() {
                let params = {
                    user_id: this.user_id,
                    project_id: this.project_id,
                    page_index: this.modelPageIndex,
                    page_size: this.modelPageSize
                };
                getModelsByProjectId(params).then(res => {
                    let { data, status, msg ,total} = res;
                    if (status == 200) {
                        this.modelsData = data;
                        this.modelPageTotal = total;
                    } else {
                        this.modelsData = [];
                        this.$message.error(`查询模型列表失败：${msg}！`);
                    }
                }).catch(error => {
                    this.$message.error('查询模型列表失败!');
                });
            },
            //查询户型详情
            checkHouseDetail(house_id) {
                localStorage.setItem('ms_house_id', house_id);
                this.$router.push('/houseDetailPage');
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = {
                        user_id: this.user_id,
                        model_id: row.model_id
                    };
                    deleteModelById(params).then(res => {
                        let { status, msg } = res;
                        if (status == 200) {
                            this.$message.success('删除成功！');
                            if(this.modelPageIndex > 1 && this.modelsData .length == 1){
                                this.modelPageIndex = this.modelPageIndex -1;
                            }
                            this.getModelList();
                        } else {
                            this.$message.error('删除失败:' + msg);
                        }

                    }).catch(error => {
                        this.$message.error('删除失败！');
                    });
                }).catch(() => {
                    this.$message.info('取消删除!');
                });
            },
            // 模型分页导航
            handleModelPageChange(val) {
               this.modelPageIndex = val;
                this.getModelList();
            },
            // 跳转至模型测试页面
            toTestModel(row) {
                let params = JSON.parse(JSON.stringify(row));
                params.project_id  = parseInt(this.project_id);
                this.$router.push({ name: 'testOncePage', params: params });
            },
            //页面跳转
            handleMoveTo(path) {
                this.$router.push(path);
            },
            //模型训练
            handleMoveToTrain() {
                this.$router.push({ name: 'modelTrainPage', params: { project_id: this.project_id } });
            },
            //添加户型
            handleAddHouse() {
                this.$router.push({ name: 'houseAddPage', params: { project_id: this.project_id } });
            },
            //户型分页显示
            handleHousePageChange(val) {
                this.housePageIndex = val;
                this.getHousesList();
            }
        }
    };
</script>


<style scoped lang="less">
    .project-main {
        float: left;
        width: 250px;
        height: 250px;
        border: 1px dashed gray;
    }

    .project-message {
        margin-left: 8px;
        width: 78%;
        float: left;
    }

    .house-contain {
        display: flex;
        justify-content: left;
        align-items: center;
    }

    .house-main {
        border: 1px dashed gray;
        width: 18%;
        margin: 10px;
        padding-bottom: 6px;
    }

    .house-image {
        cursor: pointer;
        text-align: center;
        width: 100%;
        height: 154px;
        padding: 10px;
        box-sizing: border-box;

        .image-list {
            width: 100%;
            height: 100%;
        }
    }

    .img-info {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .red {
        color: #ff0000;
    }

    .project-detail {
        margin-bottom: 10px;

        .detail-info {
            display: flex;

            .project-main {
                width: 240px;
                height: 240px;
                border: 1px dashed #000;
                padding: 10px;
            }

            .project-main-img {
                width: 100%;
                height: 100%;
            }

            .project-message {
                flex: 1;
            }
        }
    }

</style>
