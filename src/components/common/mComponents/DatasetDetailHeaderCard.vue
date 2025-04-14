<template>
    <div class="dataset-detail">
        <!-- 数据集信息部分 -->
        <el-card shadow="hover" style="height:400px;">
            <div slot="header" class="clearfix">
                <span>数据集详细</span>
            </div>
            <div class="project-main">
                <div class="prject-image-image">
                    <img class="table-td-thumb" :src="image"
                         style="width: 220px;height: 220px;"/>
                </div>
            </div>
            <div class="project-message">
                <el-card shadow="hover">
                    <div slot="header" class="clearfix">
                        <span>详细信息</span>
                    </div>
                    <el-table :data="tableDatasetData" border class="table"
                              header-cell-class-name="table-header" style="width: 100%;">
                        <el-table-column prop="id" label="数据集ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="数据集" align="center"></el-table-column>
                        <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
                        <el-table-column prop="update_time" label="最后更新时间" align="center"></el-table-column>
                        <!--<el-table-column prop="class_num" label="数据集类别数" align="center"></el-table-column>-->
                        <!-- <el-table-column prop="data_num" label="已标注总数" align="center"></el-table-column> -->
                        <el-table-column prop="data_num" label="数据集图片总数" align="center"></el-table-column>
                    </el-table>
                    <el-table :data="tableDatasetData" border class="table"
                              header-cell-class-name="table-header" style="width: 100%;">
                        <el-table-column prop="detail" label="项目简介" align="center" style="height: 600px;">
                        </el-table-column>
                    </el-table>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>

    export default {
        name: 'DatasetDetailHeaderCard',
        props:['tableDatasetData','image']
    };
</script>

<style scoped lang="less">
    .dataset-detail {
        background: #ffffff;
    }

    .project-main {
        float: left;
        width: 20%;
        border: 1px dashed gray;
    }

    .prject-image-image {
        text-align: center;
        width: 98%;
        margin: 10px 2%;
    }

    .project-message {
        margin-left: 8px;
        width: 78%;
        float: left;
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