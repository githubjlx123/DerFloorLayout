<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 项目
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看项目</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">

            <div class="handle-box">
                <el-input v-model="checkProjectName" placeholder="请输入项目名称" class="handle-input mr10"
                          clearable @keyup.enter.native="handleSearch"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch"
                >搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

                <el-table-column type="index" label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{(pageIndex - 1)*pageSize + scope.$index + 1}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="id" label="ID" align="center" width="100"></el-table-column>

                <el-table-column sortable="custom" prop="name" label="项目名称" align="center"></el-table-column>

                <el-table-column label="项目图片" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="$serverUrl + scope.row.image"
                                  :preview-src-list="[$serverUrl + scope.row.image]">
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="mission" label="项目类型" align="center">
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

                <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="update_time" label="创建时间" align="center"></el-table-column>

                <el-table-column prop="detail" label="项目简介" show-overflow-tooltip></el-table-column>
                <el-table-column prop="is_delete" label="是否被删除" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.is_delete == 0" class="green-text">未删除</div>
                        <div v-else  class="red-text">已删除</div>
                    </template>
                </el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button slot-scope="scope" :disabled="scope.row.is_delete===0 ? false : true" type="text" icon="el-icon-search"
                               @click="checkProjectDetail(scope.$index, scope.row.id)">查看详细
                    </el-button>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                               :page-size="pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
    </div>

</template>

<script>
    import {getFuzzyProjectsByName} from '@/api/ProjectManage'

    export default {
        name: 'AdminProjectInfo',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                pageIndex: 1,//页码
                pageSize: 6,//页大小
                pageTotal: 0,//总条数
                tableData: [],//项目列表
                checkProjectName: '',//搜索框
            };
        },
        created() {
            this.getProjectTable();
        },
        methods: {
            // 获取项目列表
            getProjectTable() {
                let params = {
                    admin_id: this.user_id,
                    project_name:this.checkProjectName,
                    page_index:this.pageIndex,
                    page_size:this.pageSize
                }
                getFuzzyProjectsByName(params).then(res => {
                        let {data,status,msg,total} = res;
                        if(status == 200){
                            this.tableData = data;
                            this.pageTotal = total;
                        }else {
                            this.$message.error(`查询项目数据失败:${msg}!`);
                        }
                }).catch(error =>{
                    this.$message.error(`查询项目数据失败!`)
                });
            },
            // 查看详细项目页面
            checkProjectDetail(index, project_id) {
                localStorage.setItem('ms_project_id', project_id);
                this.$router.push('/admin_projectDetail');

            },
            // 触发搜索按钮
            handleSearch() {
               this.pageIndex = 1;
               this.getProjectTable();
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getProjectTable();
            },
        }
    };
</script>

<style scoped lang="less">
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