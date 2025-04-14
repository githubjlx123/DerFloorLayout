<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 数据集
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看数据集</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="checkDatasetName" placeholder="数据集名称" class="handle-input mr10"
                          clearable @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

                <el-table-column type="index" label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{(pageIndex - 1)*pageSize + scope.$index + 1}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="id" label="数据集ID" align="center"></el-table-column>

                <el-table-column prop="name" label="数据集名称" align="center"></el-table-column>

                <el-table-column label="封面图片" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="$serverUrl + scope.row.image"
                                  :preview-src-list="[$serverUrl + scope.row.image]">
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="project_id" label="所属项目id" align="center"></el-table-column>

                <el-table-column prop="project_name" label="所属项目名称" align="center"></el-table-column>

                <el-table-column prop="mission" label="所属项目类型" align="center">
                    <div slot-scope="scope" v-if="scope.row.project_type == 1">
                        <el-tag type="normal">分类任务</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.project_type == 2">
                        <el-tag type="danger">检测任务</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.project_type == 3">
                        <el-tag type="success">分割任务</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="data_num" label="数据数量" align="center"></el-table-column>

                <el-table-column prop="detail" label="数据集介绍"></el-table-column>
                <el-table-column prop="is_delete" label="是否被删除" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_delete == 0" class="green-text">未删除</div>
                        <div v-else  class="red-text">已删除</div>
                    </template>
                </el-table-column>


                <el-table-column label="详细" align="center">
                    <el-button slot-scope="scope" type="text" icon="el-icon-search"
                               @click="checkDatasetDetail(scope.$index,scope.row.project_id, scope.row.id,scope.row.user_id)">查看详细
                    </el-button>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                               :page-size="pageSize" :total="pageTotal"
                               @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import { getFuzzyDatasetsByName } from '@/api/DatasetManage.js';

    export default {
        name: 'DatasetList',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                pageIndex: 1,//页码
                pageSize: 6,//页大小
                pageTotal: 0,//总条数
                tableData: [],//数据集列表
                checkDatasetName: '',//过滤条件
            };
        },
        created() {
            this.getDatasetTable();
        },
        methods: {
            //查询数据集表格
            getDatasetTable() {
                let params = {
                    admin_id: this.user_id,
                    dataset_name: this.checkDatasetName,
                    page_index:this.pageIndex,
                    page_size:this.pageSize
                };
                getFuzzyDatasetsByName(params).then(res => {
                    let { status, msg, data ,total} = res;
                    if (status == 200) {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error(`查询数据集失败:${msg}!`);
                    }
                }).catch(error =>{
                    this.$message.error('查询数据集失败!')
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.pageIndex = 1;
                this.getDatasetTable();
            },
            // 查看数据集页面
            checkDatasetDetail(index, project_id, dataset_id,user_id) {
                localStorage.setItem('ms_project_id', project_id);
                localStorage.setItem('ms_dataset_id', dataset_id);
                localStorage.setItem('ms_dataset_userId', user_id);
                this.$router.push('/admin_datasetDetail');
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getDatasetTable();
            },
        }
    };
</script>

<style scoped lang="less">
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
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

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 80px;
        height: 80px;
    }

    .green-text{
        color:#67C23A
    }
    .red-text{
        color:#F56C6C
    }

</style>