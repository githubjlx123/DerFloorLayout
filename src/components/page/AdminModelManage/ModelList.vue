<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 模型
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看模型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div class="handle-box">
                <el-input v-model="checkModelName" placeholder="模型名称" class="handle-input mr10" clearable
                          @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                <el-table-column prop="model_id" label="模型ID" align="center"></el-table-column>

                <el-table-column prop="model_name" label="模型名称" align="center" show-overflow-tooltip></el-table-column>

                <el-table-column prop="project_id" label="所属项目id" align="center"></el-table-column>

                <el-table-column prop="project_name" label="所属项目名称" align="center"></el-table-column>

                <el-table-column prop="train_cost" label="训练时间" align="center"></el-table-column>

                <el-table-column prop="epochs" label="迭代次数" align="center"></el-table-column>

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
                <el-table-column prop="is_delete" label="是否被删除" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_delete == 0" class="green-text">未删除</div>
                        <div v-else  class="red-text">已删除</div>
                    </template>
                </el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button :disabled="scope.row.is_delete===0 ? false : true" slot-scope="scope" type="text" icon="el-icon-search"
                               @click="checkModelDetail(scope.$index, scope.row.model_id)">查看详细
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
    import { getFuzzyModelsByName } from '@/api/ModelManage.js';

    export default {
        name: 'modelList',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),//管理员ID
                pageIndex: 1,//模型列表-页码
                pageSize: 12,//模型列表-页大小
                pageTotal: 0,//模型列表-总条数
                tableData: [],//模型列表
                checkModelName: '',//模型搜索框
            };
        },
        created() {
            this.getModelTable();
        },
        methods: {
            //查询模型列表
            getModelTable() {
                let params = {
                    admin_id: this.user_id,
                    model_name: this.checkModelName,
                    page_index:this.pageIndex,
                    page_size:this.pageSize
                };
                getFuzzyModelsByName(params).then(res => {
                    let { status, msg, data ,total} = res;
                    if (status == '200') {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error(`获取模型列表失败: ${msg} !`);
                    }
                }).catch(error =>{
                    this.$message.error(`获取模型列表失败!`);
                });
            },
            //查看模型详情
            checkModelDetail(index, model_id) {
                localStorage.setItem('ms_model_id', model_id);
                this.$router.push('/admin_modelDetail');
            },
            // 触发搜索按钮
            handleSearch() {
               this.pageIndex = 1;
                this.getModelTable();
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getModelTable();
            },
        }
    };
</script>

<style scoped>
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
