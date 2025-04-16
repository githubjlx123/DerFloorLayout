<template>
    <div class="project-panel">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 项目管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>项目列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddProject">添加项目
                </el-button>
                <el-input v-model="checkProjectName" placeholder="项目名" class="handle-input mr10"
                          clearable @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">

                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{(pageIndex - 1)*pageSize + scope.$index + 1}}</div>
                    </template>
                </el-table-column>

                <el-table-column label="项目名称" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{ scope.row.name}}({{ scope.row.id}})</div>
                    </template>
                </el-table-column>

                <el-table-column label="项目图片" align="center">
                    <template slot-scope="scope">
                        <el-image class="table-td-thumb" :src="getRowImage(scope.row.image)"
                                  :preview-src-list="[$serverUrl + scope.row.image]">
                        </el-image>
                    </template>
                </el-table-column>

                <el-table-column prop="mission" label="项目类型" align="center">
                    <div slot-scope="scope" v-if="scope.row.mission == 1">
                        <el-tag type="normal"> 常规铺装项目 </el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.mission == 2">
                        <el-tag type="danger"> 整体铺装项目 </el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>

                <el-table-column prop="detail" label="项目简介" align="center" show-overflow-tooltip></el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button slot-scope="scope" type="text" icon="el-icon-search"
                               @click="checkProjectDetail(scope.$index, scope.row.id)">查看详细
                    </el-button>
                </el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="handleDelete(scope.$index, scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" :current-page="pageIndex"
                               :page-size="pageSize" :total="pageTotal"
                               @current-change="handlePageChange"></el-pagination>
            </div>
        </div>
        <el-dialog :visible.sync="showEditDialog" title="编辑项目信息" width="25%">
            <el-form :model="editForm" ref="editForm" :rules="editFormRules" label-width="auto">
                <el-form-item label="项目名称" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="项目简介" prop="detail">
                    <el-input type="textarea" rows="5" v-model="editForm.detail"></el-input>
                </el-form-item>
                <el-form-item label="项目图片">
                    <el-upload
                            class="avatar-uploader"
                            action="#"
                            :show-file-list="false"
                            :on-change="onImageChange"
                    >
                        <img v-if="editForm.image" :src="editForm.image" class="avatar">
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
    import {
        getFuzzyProjectsByUserId,
        deleteProjectById,
        updateProjectById,
    } from '@/api/ProjectManage.js';
    import {byteLength,emojiRegex} from '@utils/common.js'

    export default {
        name: 'projectList',
        data() {
            let validateProjectName = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 64) {
                    callback(new Error('项目名不能超过64个字符'));
                } else{
                    callback();
                }
            }
            let validateNameNotEmoji = (rule,value,callback)=>{
                let hasEmoji = emojiRegex.test(value) // true
                if (hasEmoji) {
                    callback(new Error('项目名中不能含有特殊符号'));
                } else{
                    callback();
                }
            }
            let validateProjectDetail = (rule,value,callback)=>{
                let strlength = byteLength(value);
                if (strlength > 400) {
                    callback(new Error('项目名不能超过400个字符'));
                } else{
                    callback();
                }
            }
            return {
                user_id: localStorage.getItem('ms_user_id'),
                pageIndex: 1,
                pageSize: 6,
                pageTotal: 0,
                tableData: [],//项目表格
                checkProjectName: '',//搜索项目名称输入框
                showEditDialog: false,//项目编辑弹框
                editForm: {
                    id: '',
                    name: '',
                    detail: '',
                    image: '',
                    file: '',
                    file_name: ''
                },//项目编辑表单
                editFormRules:{
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' },
                        { validator: validateProjectName, trigger: 'blur' },
                        { validator: validateNameNotEmoji, trigger: 'blur' },
                    ],
                    detail:[
                        { validator: validateProjectDetail, trigger: 'change' },
                    ]
                },//项目编辑规则
            };
        },
        created() {
            this.getData(1);
        },
        methods: {
            // 数字格式修改
            formatNumberWithCommas(row, column, cellValue) {
                // 处理可能的 null 或 undefined 值
                if (cellValue == null) return '';
                
                // 将数字转换为字符串并添加千位分隔符
                return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
                // return Number(cellValue).toLocaleString('en-US');
            },
            // 获取项目列表
            getData(page) {
                let params = {
                    user_id: this.user_id,
                    project_name: this.checkProjectName,
                    page_index:page,
                    page_size:this.pageSize
                };
                getFuzzyProjectsByUserId(params).then(res => {
                    let { status, msg, data,total} = res;
                    if (status == '200') {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error('查询项目列表失败:' + msg);
                    }
                }).catch(error =>{
                    this.$message.error('查询项目列表失败！');
                });
            },
            // 查看详细项目页面
            checkProjectDetail(index, project_id) {
                localStorage.setItem('ms_project_id', project_id);
                this.$router.push('/projectDetailPage');
            },
            //跳转至创建项目页面
            toAddProject() {
                this.$router.push('/projectAddPage');
            },
            // 触发搜索按钮
            handleSearch() {
                this.pageIndex = 1;
                this.getData(this.pageIndex);
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getData(this.pageIndex);
            },
            //删除项目
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('删除后无法恢复，确定要删除该项目吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = {
                        user_id: this.user_id,
                        project_id: row.id
                    };
                    deleteProjectById(params).then(res => {
                        let { msg, status } = res;
                        if (status == 200) {
                            this.$message.success('删除项目信息成功！');
                            if(this.pageIndex > 1 && this.tableData.length == 1){
                                this.pageIndex = this.pageIndex -1;
                            }
                            this.getData(this.pageIndex);
                        } else {
                            this.$message.error('删除项目信息失败:' + msg+'!');
                        }
                    }).catch(error => {
                        this.$message.error('删除项目信息失败！');
                    });
                }).catch(() => {
                    // this.$message.info('取消删除!');
                });
            },
            //编辑项目
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
            //提交编辑
            onEditSubmit() {
                let formData = new FormData();
                formData.append('user_id', this.user_id);
                formData.append('project_id', this.editForm.id);
                formData.append('project_name', this.editForm.name);
                formData.append('project_detail', this.editForm.detail);
                formData.append('file_name', this.editForm.file_name);
                formData.append('file', this.editForm.file);
                updateProjectById(formData).then(res => {
                    let {data,status,msg} = res;
                    if(status == 200){
                        this.$message.success('修改项目信息成功!');
                        this.getData(this.pageIndex);
                        this.showEditDialog = false;
                    }else {
                        this.$message.error(`修改项目信息失败:${msg}！`)
                    }
                }).catch(error => {
                    this.$message.error('修改项目信息失败!');
                });
            },
            //提交项目图片
            onImageChange(file) {
                this.editForm.image = URL.createObjectURL(file.raw);
                this.editForm.file = file.raw;
                this.editForm.file_name = file.name;
            },
            //返回图片地址
            getRowImage(imgPath) {
                return `${this.$serverUrl}${imgPath}`;
            }
        }
    };
</script>

<style scoped lang="less">
    .project-panel {
        height: 100%;
    }

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

    .avatar-uploader {
        width: 180px;
        height: 180px;
    }

    /deep/ .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        width: 150px;
        height: 150px;
    }

    /deep/ .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
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
