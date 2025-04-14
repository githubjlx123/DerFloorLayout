<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户信息
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">

                <el-button type="primary" icon="el-icon-plus" class="handle-del mr10" @click="toAddUserPage">添加新用户
                </el-button>

                <el-input v-model="searchName" class="handle-input mr10" clearable
                          @keyup.enter.native="handleSearch"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable"
                      header-cell-class-name="table-header">
                <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" align="center"></el-table-column>
                <el-table-column prop="username" label="用户名" align="center"></el-table-column>
                <el-table-column prop="email" label="用户邮箱" align="center"></el-table-column>
                <el-table-column prop="phone" label="联系方式" align="center"></el-table-column>
                <el-table-column prop="level" label="级别" align="center"></el-table-column>
                <el-table-column prop="detail" label="用户备注" align="center"></el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.status == 0">
                            <el-tag type="success">正常</el-tag>
                        </div>
                        <div v-else>
                            <el-tag type="danger">锁定</el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit"
                                   @click="handleEdit(scope.$index, scope.row, scope.row.id)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-lock" class="red" :disabled="scope.row.status == 1"
                                   @click="handleFreeze(scope.$index, scope.row)">{{scope.row.status == 0 ? '冻结':'已冻结'}}
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="userEditForm" label-width="70px">
                <el-form-item label="用户ID">
                    <el-input v-model="userEditForm.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户邮箱">
                    <el-input v-model="userEditForm.email" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="用户名">
                    <el-input v-model="userEditForm.username"></el-input>
                </el-form-item>
                <el-form-item label="用户备注">
                    <el-input type="textarea" rows="5" v-model="userEditForm.detail"></el-input>
                </el-form-item>
                <el-form-item label="联系方式">
                    <el-input v-model="userEditForm.phone"></el-input>
                </el-form-item>
                <el-form-item label="用户级别">
                    <el-input v-model="userEditForm.level"></el-input>
                </el-form-item>
                <el-form-item label="用户状态">
                    <el-radio-group v-model="userEditForm.status">
                        <el-radio label="0">正常</el-radio>
                        <el-radio label="1">锁定</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
				<el-button @click="editVisible = false">取 消</el-button>
				<el-button type="primary" @click="saveEdit">确 定</el-button>
			</span>
        </el-dialog>

    </div>
</template>

<script>
    import { getFuzzyUsersByName, updateUserById } from '@/api/UserManage.js';

    export default {
        name: 'basetable',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                searchName: '',//搜索输入框
                tableData: [],//用户列表
                pageTotal: 0,
                pageSize: 12,
                pageIndex: 1,
                editVisible: false,//编辑弹框
                userEditForm: {
                    username: '',
                    id: '',
                    email: '',
                    detail: '',
                    phone: '',
                    level: '',
                    status: ''
                },//编辑表单
                editUserId: -1,//编辑用户的ID
            };
        },
        created() {
            this.getUserTable();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getUserTable() {
                let params = {
                    admin_id: this.user_id,
                    user_name: this.searchName,
                    page_index: this.pageIndex,
                    page_size: this.pageSize
                };
                getFuzzyUsersByName(params).then((res) => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.tableData = data;
                        this.pageTotal = total;
                    } else {
                        this.$message.error(`查询用户列表失败:${msg}!`);
                    }
                }).catch(error => {
                    this.$message.error('查询用户列表失败!');
                });
            },
            // 触发搜索按钮
            handleSearch() {
                this.getUserTable();
            },
            // 冻结操作
            handleFreeze(index, row) {
                // 二次确认冻结
                this.$confirm('确定要冻结改用户吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = new FormData();
                    for(let ele in row){
                        if(ele == 'id'){
                            params.append('user_id',row[ele])
                        }
                        else {
                            params.append(ele,row[ele])
                        }
                    }
                    params.append('status','1')
                    updateUserById(params).then(res => {
                            let { msg, status } = res;
                            if (status == 200) {
                                this.$message.success('冻结成功！');
                                this.getUserTable(this.pageIndex);
                            } else {
                                this.$message.error('冻结失败:' + msg);
                            }
                        }).catch(error => {
                            this.$message.error('冻结失败！');
                        });

                    })
                    .catch(() => {
                    });
            },
            // 跳转至添加用户页面
            toAddUserPage() {
                this.$router.push('/admin_addUserPage');
            },
            // 编辑操作
            handleEdit(index, row, id) {
                this.idx = index;
                this.editUserId = id;
                this.userEditForm.username = row.username;
                this.userEditForm.id = row.id;
                this.userEditForm.email = row.email;
                this.userEditForm.detail = row.detail;
                this.userEditForm.phone = row.phone;
                this.userEditForm.level = row.level;
                this.userEditForm.status = row.status.toString();
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                let formData = new FormData();
                formData.append('user_id', this.userEditForm.id);
                formData.append('username', this.userEditForm.username);
                formData.append('email', this.userEditForm.email);
                formData.append('status', this.userEditForm.status);
                formData.append('detail', this.userEditForm.detail);
                formData.append('phone', this.userEditForm.phone);
                formData.append('level', this.userEditForm.level);
                updateUserById(formData).then(res => {
                    let { status, msg } = res;
                    if (status == 200) {
                        this.$message.success('成功修改id为' + this.userEditForm.id.toString() + '的用户信息');
                        this.editVisible = false;
                    } else {
                        this.$message.error('修改失败：' + msg);
                    }
                    this.getUserTable();
                }).catch(error => {
                    this.$message.error('修改失败！');
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.pageIndex = val;
                this.getUserTable();
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

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

</style>
