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
                                <template slot-scope="scope">
                                    <div>{{houseNumTotal}}</div>
                                </template>
                            </el-table-column>
                            
                            <el-table-column label="房间数量" align="center">
                                <template slot-scope="scope">
                                    <div>{{roomNumTotal}}</div>
                                </template>
                            </el-table-column>

                        </el-table>
                        <el-table :data="project" border class="table"
                                  header-cell-class-name="table-header" style="width: 100%;">


                            <el-table-column label="户型总面积（平米）" align="center" width="240" :formatter="formatNumberWithCommas">
                                <template slot-scope="scope">
                                    <div>{{houseAreaTotal.toFixed(2)}}</div>
                                </template>
                            </el-table-column>
                            
                            <el-table-column label="户型总踢脚线（米）" align="center" width="240" :formatter="formatNumberWithCommas">
                                <template slot-scope="scope">
                                    <div>{{houseLengthTotal.toFixed(2)}}</div>
                                </template>
                            </el-table-column>

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
                <span>详细信息</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="handleMoveTo('/houseListPage')">
                    【查看更多】
                </el-button>
                <el-button style="float: right; padding: 3px 0" type="text"
                           @click="handleMoveToTrain('')">
                    【导出数据】
                </el-button>
            </div>

            <el-table :data="housesData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{ (housePageIndex - 1) * housePageSize + scope.$index + 1 }}</div>
                    </template>
                </el-table-column>
               
                <el-table-column label="户型名称" align="center">
                    <template slot-scope="scope">
                        <div>{{ scope.row.name }}({{ scope.row.id }})</div>
                    </template>
                </el-table-column>
                
                <el-table-column label="封面图片" align="center">
                    <template slot-scope="scope">
                        <el-image
                            class="table-td-thumb"
                            :src="getImagePath(scope.row.image)"
                            :preview-src-list="[$serverUrl + scope.row.image]"
                        >
                            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="room_num" label="房间数量" align="center"></el-table-column>
                <el-table-column prop="house_area" label="铺装面积（平方毫米）" align="center" :formatter="formatNumberWithCommas"></el-table-column>
                <el-table-column prop="house_length" label="踢脚线总长（毫米）" align="center" :formatter="formatNumberWithCommas"></el-table-column>

                <!-- <el-table-column prop="mission" label="所属项目类型" align="center">
                    <div slot-scope="scope" v-if="scope.row.project_type == 1">
                        <el-tag type="normal"> 常规铺装项目</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.project_type == 2">
                        <el-tag type="danger"> 整体铺装项目</el-tag>
                    </div>
                </el-table-column> -->

                <el-table-column prop="is_pave" label="铺装状态" align="center">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.is_pave == 1" type="success" effect="dark" style="font-weight: bold;">
                                已铺装 √
                            </el-tag>
                            <el-tag v-if="scope.row.is_pave == 0" type="danger" effect="dark" style="font-weight: bold;">
                                未铺装 ×
                            </el-tag>
                        </template>
                </el-table-column>

                <el-table-column prop="house_loss" label="铺装损耗率" align="center" show-overflow-tooltip></el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button
                        slot-scope="scope"
                        type="text"
                        icon="el-icon-search"
                        @click="checkHouseDetail(scope.row.id)"
                        >查看详细
                    </el-button>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑 </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(scope.$index, scope.row)"
                            >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>



            <!-- <el-table :data="modelsData" border class="table" ref="multipleTable"
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
            </el-table> -->
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="housePageIndex"
                               :page-size="housePageSize" :total="housePageTotal" @current-change="handleHousePageChange">
                </el-pagination>
            </div>
        </el-card>
    </div>
</template>

<script>
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
                main_image: '',//项目图片
                
                housePageIndex: 1,//户型页码
                housePageSize: 6,//户型页大小
                housePageTotal: 0,//户型总条数

                houseNumTotal: 0,
                roomNumTotal: 0,

                houseAreaTotal: 0,
                houseLengthTotal: 0,
                avgLoss: 0,
            };
        },
        created() {
            this.getProjectDetail();
            this.getHousesList();
        },
        methods: {
            //图片地址
            getImagePath(image_name) {
                return (this.$serverUrl + image_name);
            },
            // 数字格式修改
            formatNumberWithCommas(row, column, cellValue) {
                // 处理可能的 null 或 undefined 值
                if (cellValue == null) return '';
                
                // 将数字转换为字符串并添加千位分隔符
                return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
                // return Number(cellValue).toLocaleString('en-US');
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
                    let { data, status, msg ,house_total, room_total, area_total, length_total} = res;
                    if (status == 200) {
                        this.housesData = data;

                        this.houseNumTotal = house_total;
                        this.roomNumTotal = room_total;
                        this.housePageTotal = house_total;//户型总条数

                        this.houseAreaTotal = area_total / 1000000;
                        this.houseLengthTotal =  length_total / 1000;
                        this.avgLoss = 0;


                    } else {
                        this.housesData = [];
                        this.$message.error(`查询户型列表失败：${msg}！`);
                    }
                }).catch(error => {
                    this.housesData = [];
                    this.$message.error('查询户型列表失败!');
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
                        house_id: row.house_id
                    };
                    deleteHouseById(params).then(res => {
                        let { status, msg } = res;
                        if (status == 200) {
                            this.$message.success('删除成功！');
                            if(this.housePageIndex > 1 && this.housePageIndex .length == 1){
                                this.housePageIndex = this.housePageIndex -1;
                            }
                            this.getHousesList();
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
            handleHousePageChange(val) {
               this.housePageIndex = val;
               this.getHousesList();
            },
            //页面跳转
            handleMoveTo(path) {
                this.$router.push(path);
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
