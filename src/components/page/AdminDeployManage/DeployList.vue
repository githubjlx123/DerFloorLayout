<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 部署
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看部署</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-input v-model="checkModelName" placeholder="请输入部署ID" class="handle-input mr10"
                          clearable @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="deploy_id" label="部署ID" align="center" width="65"></el-table-column>
                <el-table-column prop="name" label="部署名称" align="center"></el-table-column>

                <el-table-column prop="project_message" label="所属项目" align="center"></el-table-column>

                <el-table-column prop="dataset_message" label="所属数据集" align="center"></el-table-column>

                <el-table-column prop="model_message" label="所属模型" align="center"></el-table-column>

                <el-table-column prop="create_time" label="部署时间" align="center"></el-table-column>

                <el-table-column prop="method" label="部署方式" align="center">
                    <div slot-scope="scope" v-if="scope.row.method == 1">
                        <el-tag type="success">本地部署</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.method == 2">
                        <el-tag type="normal">在线部署</el-tag>
                    </div>
                </el-table-column>

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

                <el-table-column prop="is_delete" label="是否被删除" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_delete == 0" class="green-text">未删除</div>
                        <div v-else class="red-text">已删除</div>
                    </template>
                </el-table-column>

                <el-table-column label="使用" align="center">
                    <div slot-scope="scope" v-if="scope.row.method == 1">
                        <el-button type="text" icon="el-icon-download">立即下载
                        </el-button>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.method == 2">
                        {{scope.row.path}}
                    </div>
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
    import { getFuzzyDeploysByName } from '@/api/DeployManage.js';

    export default {
        name: 'modelList',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),//管理员ID
                pageIndex: 1,//部署列表索引
                pageSize: 10,//部署列表大小
                pageTotal: 0,//部署列表总条数
                tableData: [],//部署列表
                checkModelName: '',//部署ID搜索框
            };
        },
        created() {
            this.getData();
        },
        methods: {
            //查询部署列表
            getData() {
                let params = {
                    admin_id: this.user_id,
                    deploy_name: this.checkModelName,
                    page_index: this.pageIndex,
                    page_size: this.pageSize
                };
                getFuzzyDeploysByName(params).then(res => {
                    let { status, data, msg } = res;
                    if (status == 200) {
                        this.tableData = data;
                        this.pageTotal = data.length;
                    } else {
                        this.$message.error('数据获取失败：' + msg + '!');
                    }
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.pageIndex = 1;
                this.getData();
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getData();
            },
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .mr10 {
        margin-right: 10px;
    }

    .green-text {
        color: #67C23A
    }

    .red-text {
        color: #F56C6C
    }
</style>
