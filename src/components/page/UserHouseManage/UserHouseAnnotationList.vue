<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 户型管理 </el-breadcrumb-item>
                <el-breadcrumb-item>户型标注</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddHouse">添加户型</el-button>
                <el-input
                    v-model="house_name"
                    placeholder="户型名称"
                    class="handle-input mr10"
                    clearable
                    @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</div>
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
                            :src="$serverUrl + scope.row.image"
                            :preview-src-list="[$serverUrl + scope.row.image]"
                        >
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="mission" label="所属项目类型" align="center">
                    <div slot-scope="scope" v-if="scope.row.project_type == 1">
                        <el-tag type="normal"> 常规铺装项目</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.project_type == 2">
                        <el-tag type="danger"> 整体铺装项目</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="label_num" label="标注数量" align="center"></el-table-column>

                <el-table-column prop="data_num" label="数据总数" align="center"></el-table-column>

                <el-table-column prop="label_percent" label="标注率" align="center">
                    <div slot-scope="scope" v-if="scope.row.label_percent >= 100">
                        <b
                            ><p style="color: green">{{ scope.row.label_percent }} % √</p></b
                        >
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.label_percent < 100">
                        <b
                            ><p style="color: red">{{ scope.row.label_percent.toFixed(2) }} %</p></b
                        >
                    </div>
                </el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button
                        slot-scope="scope"
                        type="text"
                        icon="el-icon-search"
                        @click="checkHouseDetail(scope.$index, scope.row.project_id, scope.row.id)"
                        >查看详细</el-button
                    >
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-right" class="red" @click="toAnnotationPage(scope.row.id, scope.row)">
                            【去标注】</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { getFuzzyHousesByUserIdForAnnotation } from '@/api/HouseManage.js';

export default {
    name: 'houseList',
    data() {
        return {
            user_id: localStorage.getItem('ms_user_id'),
            pageIndex: 1, //页码
            pageSize: 6, //页大小
            pageTotal: 0, //总条数
            tableData: [], //户型表格
            house_name: '' //户型名称搜索框
        };
    },
    created() {
        this.getData();
    },
    methods: {
        //查询户型列表
        getData() {
            let params = {
                user_id: this.user_id,
                house_name: this.house_name,
                page_index: this.pageIndex,
                page_size: this.pageSize
            };
            getFuzzyHousesByUserIdForAnnotation(params)
                .then((res) => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error('查询户型失败:' + msg);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询户型失败!');
                });
        },
        // 触发搜索按钮
        handleSearch() {
            this.pageIndex = 1;
            this.getData();
        },
        // 查看户型详情页面
        checkHouseDetail(index, project_id, house_id) {
            localStorage.setItem('ms_project_id', project_id);
            localStorage.setItem('ms_house_id', house_id);
            this.$router.push('/houseDetailPage');
        },
        //新增户型
        toAddHouse() {
            this.$router.push('/houseAddPage');
        },
        // 分页导航
        handlePageChange(val) {
            this.pageIndex = val;
            this.getData();
        },
        // 跳转至标注页面
        toAnnotationPage(house_id, row) {
            localStorage.setItem('ms_project_id', row.project_id);
            this.$router.push({ path: '/toUserHouseAnnotationPage', query: { house_id: house_id, index: '1' } });
        }
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
</style>
