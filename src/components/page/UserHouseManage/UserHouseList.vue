<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 户型管理 </el-breadcrumb-item>
                <el-breadcrumb-item>查看户型</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddHouse">添加户型 </el-button>
                <el-input
                    v-model="checkHouseName"
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
                            :src="getRowImage(scope.row.image)"
                            :preview-src-list="[$serverUrl + scope.row.image]"
                        >
                            <div slot="placeholder" class="image-slot">加载中<span class="dot">...</span></div>
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="project_id" label="所属项目id" align="center"></el-table-column>
                <el-table-column prop="project_name" label="所属项目名称" align="center"></el-table-column>
                <el-table-column prop="mission" label="所属项目类型" align="center">
                    <div slot-scope="scope" v-if="scope.row.project_type == 1">
                        <el-tag type="normal"> 常规铺装项目</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.project_type == 2">
                        <el-tag type="danger"> 整体铺装项目</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="data_num" label="图纸数量" align="center"></el-table-column>

                <el-table-column prop="detail" label="户型介绍" align="center" show-overflow-tooltip></el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button
                        slot-scope="scope"
                        type="text"
                        icon="el-icon-search"
                        @click="checkHouseDetail(scope.$index, scope.row.project_id, scope.row.id)"
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
        <el-dialog :visible.sync="showEditDialog" title="编辑户型信息" width="25%">
            <el-form :model="editForm" ref="editForm" label-width="auto">
                <el-form-item label="户型名称">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="户型简介">
                    <el-input type="textarea" rows="5" v-model="editForm.detail"></el-input>
                </el-form-item>
                <el-form-item label="户型图片">
                    <el-upload class="avatar-uploader" action="#" :show-file-list="false" :on-change="onImageChange">
                        <img v-if="editForm.image" :src="editForm.image" class="avatar" />
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
                <div class="edit-btn">
                    <el-button type="primary" @click="onEditSubmit">立即修改</el-button>
                    <el-button @click="showEditDialog = false">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { mapMutations } from 'vuex';
import { getFuzzyHousesByUserId, deleteHouseById, updateHouseById } from '@/api/HouseManage.js';

export default {
    name: 'houseList',
    data() {
        return {
            user_id: localStorage.getItem('ms_user_id'),
            pageIndex: 1,
            pageSize: 6,
            pageTotal: 0,
            tableData: [], //户型表格数据
            checkHouseName: '', //搜索框
            showEditDialog: false, //编辑户型信息弹框
            editForm: {
                id: '',
                name: '',
                detail: '',
                image: '',
                file: '',
                file_name: ''
            } //编辑户型表单
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
                house_name: this.checkHouseName,
                page_index: this.pageIndex,
                page_size: this.pageSize
            };
            getFuzzyHousesByUserId(params)
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
            // this.$router.push('/houseDetailPage');
            localStorage.setItem('ms_house_id', house_id);
            // this.$store.commit('detectionData/setHouseId', house_id);
            this.$router.push({
                name: 'houseDetailPage',
                params: {
                    projectId: project_id,
                    houseId: house_id,
                    
                }
            });
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        user_id: this.user_id,
                        house_id: row.id
                    };
                    deleteHouseById(params)
                        .then((res) => {
                            this.$message.success('删除户型信息成功!');
                            if (this.pageIndex > 1 && this.tableData.length == 1) {
                                this.pageIndex = this.pageIndex - 1;
                            }
                            this.getData();
                        })
                        .catch((error) => {
                            this.$message.error('删除户型信息失败!');
                        });
                })
                .catch(() => {
                    this.$message.info('取消删除户型信息!');
                });
        },
        //点击添加户型
        toAddHouse() {
            this.$router.push('/houseAddPage');
        },
        // 编辑操作
        handleEdit(row) {
            for (let i in row) {
                if (i == 'image') {
                    this.editForm[i] = this.$serverUrl + row[i];
                } else {
                    this.editForm[i] = row[i];
                }
            }
            this.showEditDialog = true;
        },
        //点击修改
        onEditSubmit() {
            let formData = new FormData();
            formData.append('user_id', this.user_id);
            formData.append('house_id', this.editForm.id);
            formData.append('house_name', this.editForm.name);
            formData.append('house_detail', this.editForm.detail);
            formData.append('file_name', this.editForm.file_name);
            formData.append('file', this.editForm.file);
            updateHouseById(formData)
                .then((res) => {
                    this.$message.success('修改户型信息成功!');
                    this.getData();
                    this.showEditDialog = false;
                })
                .catch((error) => {
                    this.$message.error('修改户型信息失败!');
                });
        },
        //上传图片
        onImageChange(file) {
            this.editForm.image = URL.createObjectURL(file.raw);
            this.editForm.file = file.raw;
            this.editForm.file_name = file.name;
        },
        // 分页导航
        handlePageChange(val) {
            this.pageIndex = val;
            this.getData();
        },
        //返回图片地址
        getRowImage(imgPath) {
            return `${this.$serverUrl}${imgPath}}`;
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

.edit-btn {
    text-align: center;
}

::v-deep .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 150px;
    height: 150px;
}

::v-deep .avatar-uploader .el-upload:hover {
    border-color: #409eff;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
}

.avatar {
    width: 148px;
    height: 148px;
    display: block;
}
</style>
