<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 铺装管理
                </el-breadcrumb-item>
                <el-breadcrumb-item>查看铺装模拟结果</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <!-- <el-form-item label="选择项目" prop="project_id"> -->
                    <el-select
                        v-model="project_id"
                        placeholder="请选择"
                        class="select-length"
                    >
                        <div v-for="project in userProjects" :key="project.id">
                            <el-option :key="project.name" :label="project.name + '(' + project.id + ')'" :value="project.id">
                            </el-option>
                        </div>
                    </el-select>
                <!-- </el-form-item> -->

                <!-- <el-form-item label="选择户型" prop="house_id"> -->
                    <el-select
                        v-model="house_id"
                        placeholder="请选择"
                        class="select-length"
                    >
                        <div v-for="house in userHouses" :key="house.id">
                            <el-option :key="house.name" :label="house.name + '(' + house.id + ')'" :value="house.id">
                            </el-option>
                        </div>
                    </el-select>
                        <!-- </el-form-item> -->

                <el-input v-model="checkPlanName" placeholder="铺装名称" class="handle-input mr10"
                          clearable @keyup.enter.native="handleSearch"
                ></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>

            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header" :row-class-name="setRowClassName">
                <el-table-column label="序号" width="55" align="center">
                    <template slot-scope="scope">
                        <div>{{(pageIndex - 1)*pageSize + scope.$index + 1}}</div>
                    </template>
                </el-table-column>

                <el-table-column  label="铺装名称" align="center" width="220" show-overflow-tooltip>
                    <template slot-scope="scope">
                      <div>{{ scope.row.pave_name}}({{ scope.row.pave_id}})</div>
                    </template>
                </el-table-column>

                <el-table-column label="所属项目名称" align="center" width="180" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{ scope.row.project_name}}({{ scope.row.project_id}})</div>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="模拟时间" width="180" align="center"></el-table-column>
                <el-table-column prop="train_cost" label="花费时间(s)" align="center"></el-table-column>

                <el-table-column prop="need_area" label="铺装面积(平米)" align="center">
                    <template slot-scope="scope">
                        <div>{{ formatNumberWithCommas(scope.row.need_area / 1000000)}}</div>
                    </template>
                </el-table-column>

				<el-table-column prop="floor_area" label="地板面积(平米)" align="center">
                    <template slot-scope="scope">
                        <div>{{ formatNumberWithCommas(scope.row.floor_area / 1000000)}}</div>
                    </template>
                </el-table-column>
				<el-table-column prop="count" label="地板数量(片)" align="center">
                    <template slot-scope="scope">
                        <div>{{ formatNumberWithCommas(scope.row.count)}}</div>
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="铺装状态" align="center">
                    <div slot-scope="scope" v-if="scope.row.status == '1'">
                        <el-tag type="success">模拟完成</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == '0'">
                        <el-tag type="normal"> 模拟中...</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == '2'">
                        <el-tag type="warning"> 已终止</el-tag>
                    </div>
                    <div slot-scope="scope" v-else-if="scope.row.status == '3'">
                        <el-tag type="danger"> 模拟异常</el-tag>
                    </div>
                </el-table-column>

                <el-table-column prop="accuracy" label="地板损耗率" align="center"></el-table-column>

                <el-table-column label="详细" align="center">
                    <el-button slot-scope="scope" type="text" icon="el-icon-search"
                               @click="checkModelDetail(scope.$index, scope.row.pave_id)">查看详细
                    </el-button>
                </el-table-column>

                <el-table-column label="操作" width="160px" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-document" @click="goToTrainReport(scope.row.pave_id)"
                        :disabled="scope.row.accuracy === 0"
                        >模拟报告
                        </el-button>
             <!--           <el-button type="text" icon="el-icon-edit" @click="handleTest(scope.$index, scope.row)"
                        :disabled="scope.row.status == 3"
                        >立即测试
                        </el-button> -->
                        <el-button type="text" icon="el-icon-delete" class="red"
                                   @click="deleteModel(scope.row.pave_id)">删除
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
        <el-dialog :visible.sync="showEditDialog" title="编辑铺装信息" width="25%">
            <el-form :model="editForm" ref="editForm" label-width="80px">
                <el-form-item label="铺装名称">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="铺装简介">
                    <el-input type="textarea" rows="5" v-model="editForm.detail"></el-input>
                </el-form-item>
                <div class="edit-btn">
                    <el-button @click="showEditDialog = false">取消</el-button>
                </div>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import { getProjectByUserIdForList } from '@/api/ProjectManage.js';
    import { getHousesByUserIdForList, getHousesByProjectIdForList } from '@/api/HouseManage.js'
    import { getFuzzyRoomByHouse} from '@/api/RoomManage.js';
    import { paveSimulate, saveSimulateResult } from '@/api/PaveManage.js'
    import { getFuzzyPaveByUserId } from '@/api/PaveManage.js';

    export default {
        name: 'modelList',
        data() {
            return {
                user_id: localStorage.getItem('ms_user_id'),
                pageIndex: 1,
                pageSize: 12,
                pageTotal: 0,
                project_id: "全部项目",
                house_id: "所有户型",
                userProjects: [], //项目下拉框
                userHouses: [], //户型下拉框
                tableData: [],//铺装列表信息
                checkPlanName: '',//铺装搜索框
                showEditDialog:false,
                editForm:{
                    name:'',
                    detail:''
                }
            };
        },
        filters: {
            ModelIdFilter(name,id) {
                return `${name}(${id})`
            },
        },
        created() {
            this.getData();
            this.getProjectData();
            this.getHouseData();
        },
        watch: {
            'project_id'(newVal) {
                if (newVal) {
                    this.getHouseByProjectId(newVal)
                } else {
                    this.userHouses = []
                    this.house_id = ''
                }
            }
        },
        methods: {
            // 数字格式修改
            formatNumberWithCommas(cellValue) {
                // 处理可能的 null 或 undefined 值
                if (cellValue == null) return '';
                
                // 将数字转换为字符串并添加千位分隔符
                return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                
                // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
                // return Number(cellValue).toLocaleString('en-US');
            },
            //查询铺装列表
            getData() {
                let params = {
                    user_id: this.user_id,
                    pave_name: this.checkPlanName,
                    page_index:this.pageIndex,
                    page_size:this.pageSize
                };
                getFuzzyPaveByUserId(params).then(res => {
                    let {data,status,msg,total} = res;
                    if(status == 200){
                        this.tableData = data;
                        this.pageTotal = total;
                    }else {
                        this.$message.error('查询铺装信息失败:'+msg);
                    }
                }).catch(error => {
                    this.$message.error('查询铺装信息失败!');
                });
            },
            //获取项目信息
            async getProjectData() {
                let params = {
                    user_id: this.user_id
                };
                await getProjectByUserIdForList(params)
                    .then((res) => {
                        let { data, status } = res;
                        if (status == 200) {
                            this.userProjects = data;
                        } else {
                            this.$message.error('获取项目数据失败!');
                        }
                    })
                    .catch((error) => {
                        this.$message.error('获取项目数据失败!');
                    });
            },
            //获取户型信息
            getHouseData() {
                let params = {
                    user_id: this.user_id
                };
                getHousesByUserIdForList(params)
                    .then((res) => {
                        let { data, status } = res;
                        if (status == 200) {
                            this.userHouses = data;
                        } else {
                            this.$message.error('获取户型失败!');
                        }
                    })
                    .catch((error) => {
                        this.$message.error('获取户型失败!');
                    });
            },
            // 通过项目ID查询户型信息
            getHouseByProjectId(projectId) {
                let params = {
                    project_id: projectId
                };
                getHousesByProjectIdForList(params)
                    .then((res) => {
                        let { data, status } = res;
                        if (status == '200') {
                            this.userHouses = data;
                        } else {
                            this.$message.error('获取数据失败!');
                        }
                    })
                    .catch((error) => {
                        this.$message.error('获取数据失败!');
                    });
            },
            //查看详情
            checkModelDetail(index, pave_id) {
                localStorage.setItem('ms_pave_id', pave_id);
                this.$router.push('/modelDetailPage');
            },
            //删除铺装
            deleteModel(pave_id) {
                // 二次确认删除
                this.$confirm('确定要删除该铺装吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    let params = {
                        user_id: this.user_id,
                        pave_id: pave_id
                    };
                    deleteModelById(params).then(res => {
                        let{status,msg} = res;
                        if(status == 200){
                            this.$message.success('删除铺装成功！');
                            if(this.pageIndex > 1 && this.tableData.length == 1){
                                this.pageIndex = this.pageIndex - 1;
                            }
                            this.getData();
                        }else {
                            this.$message.error('删除铺装失败：' + msg + '!');
                        }

                    }).catch(error => {
                        this.$message.error('删除铺装失败！' );
                    });
                }).catch(() => {
                    this.$message.info('取消删除！');
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
            //立即测试
            handleTest(index,row){
                this.$router.push({name:'testOncePage',params:row});
            },
            // 模拟报告
            goToTrainReport(pave_id){
                localStorage.setItem('ms_pave_id', pave_id)
                this.$router.push('modelTrainReport')
            },
			setRowClassName() {
			  return 'custom-row-height';
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
    
    .edit-btn{
        text-align: center;
    }
	
	.custom-row-height {
	  height: 200px; /* 设置全局行高 */
	}
</style>
