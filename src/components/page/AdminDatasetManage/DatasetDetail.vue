<template>
    <div class="dataset-detail">
        <!-- 数据集信息部分 -->
        <DatasetDetailHeaderCard :image="getImagePath(main_image)" :tableDatasetData="tableDatasetData"></DatasetDetailHeaderCard>
        <!-- 数据集图片展示 -->
        <el-card shadow="hover">
            <div slot="header" class="dataset-image-search">
                <p class="head-title">详细信息</p>
                <el-input
                    @clear="init"
                    @keyup.enter.native="handleImageSearch"
                    v-model="searchImage"
                    clearable
                    class="search-input"
                    placeholder="请输入图片名称"
                ></el-input>
                <el-button type="primary" @click="handleImageSearch">搜索</el-button>
            </div>
            <!-- 数据列表展示模式 -->
            <div>
                <el-table :data="imagesData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                    <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

                    <el-table-column prop="name" label="图片名称" align="center"></el-table-column>

                    <el-table-column label="图片" align="center">
                        <template slot-scope="scope">
                            <el-image class="table-td-thumb" :src="scope.row.image" :preview-src-list="[scope.row.image]"></el-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="size" label="图片大小" align="center"></el-table-column>
                    <el-table-column label="标注情况" align="center">
                        <template slot-scope="scope">
                            <div>{{ scope.row.label | filterLabel }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="label" label="图片类别" align="center" v-if="project_mission == 1"></el-table-column>
                    <el-table-column label="详细" align="center" v-if="project_mission == 2">
                        <template slot-scope="scope">
                            <el-button type="text" icon="el-icon-search" @click="getDetectImageWithLabel(scope.row.id)">
                                【点击查看】
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="警告" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="handleWarning(scope.$index, scope.row)"> 【私信警告】</el-button>
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
        </el-card>
        <!-- 检测结果弹出框弹出框 -->
        <el-dialog title="详细图像" :visible.sync="showDetectImageDetail" width="60%">
            <div class="rz-picter" v-if="showDetectImageDetail">
                <annotation-canvas
                    :imageSrc="showDetectImageUrl"
                    :labels="showDetectImageLabels"
                    :classList="classList"
                    :classArr="classs"
                ></annotation-canvas>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { adminAddMessage } from '@/api/Massage.js';
import {
    adminGetDatasetDetailById,
    getFuzzyImageDataByName,
    getDetectLabel,
    getClassesNameByDatasetId,
    getDatasetById
} from '@/api/DatasetManage.js';
import { getImageByPath } from '@/api/common.js';
import DatasetDetailHeaderCard from '@/components/common/mComponents/DatasetDetailHeaderCard.vue';
// import AnnotationCanvas from '@components/page/UserDatasetManage/AnnotationCanvas.vue';
import { getRandomColor, hexToRgb } from '@utils/common.js';

export default {
    name: 'DatasetDetail',
    components: {
        DatasetDetailHeaderCard,
        AnnotationCanvas
    },
    data() {
        return {
            user_id: localStorage.getItem('ms_user_id'), //管理员ID
            dataset_id: null, //数据集ID
            project_id: null, //项目ID
            main_image: '', //数据集图片
            searchImage: '', //数据集图片搜索框
            searchClass: '', //数据集搜索-图片类别
            tableDatasetData: [{}], //数据集详情
            imagesData: [], //数据集图片列表
            currentImageShow: [], //数据集分页显示列表
            pageIndex: 1, //数据集分页-页码
            pageSize: 12, //数据集分页-页大小
            pageTotal: 0, //数据集分页-总条数
            project_mission: '', //项目类别
            showDetectImageDetail: false, //标注图片详情
            showDetectImageUrl: '', //图片详情地址
            showDetectImageDetail: false, //图片详情
            showDetectImageLabels: [], //标注标签
            classList: [], //所有标注标签类别，格式化的标签类别（有随机颜色）
            classs: [], //所有标注标签类别
            receive_user_id: '', //私信接收人
            project_name: '', //项目名称
            dataset_name: '' //数据集名称
        };
    },
    filters: {
        filterLabel(label) {
            if (label) {
                return '已标注';
            } else {
                return '/';
            }
        }
    },
    created() {
        this.init();
    },
    methods: {
        init() {
            this.searchImage = '';
            this.receive_user_id = localStorage.getItem('ms_dataset_userId');
            this.getClassesName();
            this.getDatasetInfo();
        },
        //数据集封面
        getImagePath(image_name) {
            return this.$serverUrl + image_name;
        },
        //查看详情页信息
        getDatasetInfo() {
            let params = {
                user_id: this.receive_user_id,
                dataset_id: this.dataset_id
            };
            getDatasetById(params)
                .then((res) => {
                    let { data, status, msg } = res;
                    if (status == 200) {
                        this.$set(this.tableDatasetData, 0, data);
                        this.project_mission = data.project_type; //数据集类型
                        this.main_image = data.image; //数据集图片
                        this.project_name = data.project_name;
                        this.project_id = data.project_id;
                        this.dataset_name = data.name;
                        // //查询数据集图片信息
                        this.handleImageSearch();
                    } else {
                        this.$message.error('查询数据集详情失败:' + msg);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询数据集详情失败！');
                });
        },
        // 分页导航
        handlePageChange(val) {
            this.pageIndex = val;
            this.handleImageSearch();
        },
        // 绘制检测任务数据集图片
        getDetectImageWithLabel(id) {
            let params = {
                user_id: this.receive_user_id,
                dataset_id: this.dataset_id,
                imgdata_id: id
            };
            getDetectLabel(params)
                .then((res) => {
                    let { status, msg, data } = res;
                    if (status == 200) {
                        this.showDetectImageUrl = data.file_path;
                        this.showDetectImageLabels = data.label;
                        this.showDetectImageDetail = true;
                    } else {
                        this.$message.error('查询失败:' + msg);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询失败!');
                });
        },
        //私信警告
        handleWarning(index, row) {
            let params = {
                admin_id: this.user_id,
                receive_user_type: '2',
                receive_user_id: this.receive_user_id,
                title: '图片异常警告',
                priority: '3',
                content: `<p>在项目${this.project_name}(${this.project_id}),数据集${this.dataset_name}(${this.dataset_id})中图片${row.name}存在违规，请处理！</p>`
            };
            adminAddMessage(params)
                .then((res) => {
                    this.$message.success('消息发送成功!');
                })
                .catch((error) => {
                    this.$message.error('消息发送失败!');
                });
        },
        //查询图片信息
        handleImageSearch() {
            let params = {
                dataset_id: this.dataset_id,
                file_name: this.searchImage, //图片名
                class_name: this.searchClass, //类别
                page_index: this.pageIndex,
                page_size: this.pageSize
            };
            getFuzzyImageDataByName(params)
                .then((res) => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.imagesData = data;
                        this.pageTotal = total;
                        this.getImage();
                    } else {
                        this.$message.error(`查询数据集中图片失败：${msg}!`);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询数据集中图片失败!');
                });
        },
        //通过图片路径查询图片base64
        async getImage() {
            for (let i = 0; i < this.imagesData.length; i++) {
                let params = {
                    image_path: this.imagesData[i].image
                };
                await getImageByPath(params).then((res) => {
                    let { data } = res;
                    this.imagesData[i].image = data;
                    this.imagesData.splice(i, 0);
                });
            }
        },
        //查询所有类别
        getClassesName() {
            let params = {
                user_id: this.receive_user_id,
                dataset_id: this.dataset_id
            };
            getClassesNameByDatasetId(params).then((res) => {
                let { status, data } = res;
                if (status == 200) {
                    this.classs = data;
                    this.initClass(data);
                } else {
                    this.classs = [];
                    this.initClass([]);
                }
            });
        },
        //初始化类别标签
        initClass(list) {
            this.classList = [];
            list.forEach((item) => {
                let color = getRandomColor();
                let rgb = hexToRgb(color);
                let temp = {
                    labelName: item,
                    labelColor: color,
                    labelColorR: rgb.r,
                    labelColorB: rgb.b,
                    labelColorG: rgb.g
                };
                this.classList.push(temp);
            });
        }
    }
};
</script>

<style scoped lang="less">
.dataset-detail {
    background: #ffffff;
}

.dataset_message {
    margin: 10px;
    width: 100%;
}

.dataset-main {
    text-align: center;
    border: 1px dashed gray;
    width: 10%;
    margin: 10px;
    padding-bottom: 5px;
    display: flex;
}

.dataset-image {
    text-align: center;
    width: 90%;
    margin: 4%;
}

.image-list-div {
    float: left;
    text-align: center;
    border: 1px dashed gray;
    width: 20%;
    margin: 20px 2%;
    padding-bottom: 5px;
}

.image-list-image {
    text-align: center;
    width: 90%;
    margin: 4%;
}

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

.dataset-image-search {
    display: flex;

    .head-title {
        flex: 1;
    }

    .search-input {
        width: 200px;
        margin-right: 20px;
    }
}
</style>
