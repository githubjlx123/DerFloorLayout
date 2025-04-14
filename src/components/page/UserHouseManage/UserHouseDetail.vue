<template>
    <div>
        
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 户型管理 </el-breadcrumb-item>
                <el-breadcrumb-item>户型详情</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <!-- 户型信息部分 -->
        <el-card shadow="hover" class="house-detail">
            <div slot="header" class="clearfix">
                <span>户型详细</span>
            </div>
            <div class="detail-info">
                <div class="project-main">
                    <img class="project-main-img" :src="getImagePath(main_image)" />
                </div>
                <div class="project-message">
                    <el-card shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>详细信息</span>
                        </div>
                        <el-table :data="tablehouseData" border class="table" header-cell-class-name="table-header" style="width: 100%">
                            <el-table-column prop="id" label="户型ID" align="center" width="100"></el-table-column>
                            <el-table-column prop="name" label="户型" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column label="所属项目" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <div>{{ scope.row.project_name }}({{ scope.row.project_id }})</div>
                                </template>
                            </el-table-column>
                            <el-table-column label="所属项目类型" align="center">
                                <div slot-scope="scope" v-if="scope.row.project_type == 1">
                                    <el-tag type="normal"> 常规铺装项目</el-tag>
                                </div>
                                <div slot-scope="scope" v-else-if="scope.row.project_type == 2">
                                    <el-tag type="danger"> 整体铺装项目</el-tag>
                                </div>
                            </el-table-column>
                            <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
                            <!-- <el-table-column prop="update_time" label="最后更新时间" align="center"></el-table-column> -->
                            <!-- <el-table-column prop="classes_num" label="户型类别数" align="center"></el-table-column> -->
                            <el-table-column prop="total_area" label="铺装面积大小（平方毫米）" align="center" :formatter="formatNumberWithCommas"></el-table-column>
                            <el-table-column prop="data_num" label="户型房间总数" align="center"></el-table-column>
                        </el-table>
                        <el-table :data="tablehouseData" border class="table" header-cell-class-name="table-header" style="width: 100%">
                            <el-table-column prop="detail" label="项目简介" align="center" style="height: 600px"> </el-table-column>
                        </el-table>
                    </el-card>
                </div>
            </div>
        </el-card>

        <div>
            <!-- 户型房间展示 -->
            <el-card shadow="hover">
                <div slot="header" class="clearfix">
                    <span>
                        <el-button type="success" round @click="convertListAndImage">【展示格式切换】</el-button>
                    </span>
                    <span>
                        <el-select v-model="searchIsLabel" placeholder="请选择标注状态" clearable class="search-select">
                            <el-option label="全部" value="#@^@#"></el-option>
  
                            <el-option label="未标注" value="0">
                                <span style="float: left"> 未标注 ×</span>
                            </el-option>

                            <el-option label="已标注" value="1">
                                <span style="float: left"> 已标注 √</span>
                            </el-option>

                            <el-option label="标注中" value="2">
                                <span style="float: left"> 标注中 ing</span>
                            </el-option>
                        </el-select>
                        <el-input
                            v-model="searchRoomName"
                            clearable
                            class="search-input"
                            placeholder="请输入房间名称"
                            @keyup.enter.native="handleSearch"
                        ></el-input>
                        <el-button type="primary" @click="handleSearch">搜索</el-button>
                    </span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="addOneImage">【添加房间】 </el-button>
                    <!-- <el-button style="float: right; padding: 3px 0; margin-left: 0" type="text" @click="handlMultipleImage">
                        【批量添加】
                    </el-button> -->
                    <!-- <el-button style="float: right; padding: 3px 0" type="text" @click="downLoadhouse('txt')">【导出户型】</el-button> -->
                </div>

                <!-- 数据列表展示模式 -->
                <div v-if="houseShowByList">
                    <el-table :data="roomList" border class="table" ref="multipleTable" header-cell-class-name="table-header">
                        <el-table-column type="index" label="序号" width="55" align="center">
                            <template slot-scope="scope">
                                <div>{{ (pageIndex - 1) * pageSize + scope.$index + 1 }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="id" label="房间ID" align="center"></el-table-column>
                        <el-table-column prop="name" label="房间名称" align="center"></el-table-column>
                        <!-- <el-table-column prop="imageUrl" label="房间铺装区域" align="center">
                            <template slot-scope="scope">
                                <el-image
                                    class="table-td-thumb"
                                    v-if="scope.row.thumbUrl !== undefined"
                                    :src="scope.row.thumbUrl"
                                    
                                    :preview-src-list="[scope.row.imageUrl]"
                                >
                                </el-image>
                                <div v-else class="table-td-thumb image-load">
                                    加载中
                                    <i class="el-icon-loading"></i>
                                </div>
                            </template>
                        </el-table-column> -->
                        <el-table-column prop="imageUrl" label="房间铺装区域" align="center">
                            <template slot-scope="scope">
                                <el-image
                                    class="table-td-thumb"
                                    v-if="scope.row.thumbUrl !== undefined"
                                    :src="scope.row.thumbUrl"
                                    
                                    :preview-src-list="[scope.row.imageUrl]"
                                >
                                </el-image>
                                <div v-else class="table-td-thumb image-load">
                                    加载中
                                    <i class="el-icon-loading"></i>
                                </div>
                            </template>
                        </el-table-column>

                        <el-table-column prop="room_area" label="房间大小（平方毫米）" align="center" :formatter="formatNumberWithCommas"></el-table-column>

                        <el-table-column prop="is_label" label="房间标注状态" align="center">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.is_label == 1" type="success" effect="dark" style="font-weight: bold;">
                                    已标注 √
                                </el-tag>
                                <el-button v-else
                                    type="text"
                                    icon="el-icon-right"
                                    class="red"
                                    @click="toAnnotationPage(scope.$index, scope.row)"
                                >
                                    【去标注】
                                </el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="text" icon="el-icon-edit" @click="toAnnotationPage(scope.$index, scope.row)">
                                    修改
                                </el-button>
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
                        >
                        </el-pagination>
                    </div>
                </div>

                <!-- 缩略图显示模式-->
                <div v-if="houseShowByImage" class="image-panel" ref="imageCardGroup">
                    <div class="image-list-main" v-for="(image, index) in roomList" :key="index" :ref="`imageCardItem${index}`">

                        <div class="image-list-div">
                            <div class="image-list-image">
                                <!-- <img :src="getImagePath(image.image_path)" style="width: 100%; height: 100%" /> -->
                                <el-image
                                    :src="getImagePath(image.image_path)"
                                    :preview-src-list="[getImagePath(image.image_path)]"
                                    fit="cover"
                                    style="width: 100%; height: 100%">

                                    <div slot="error" class="image-slot">
                                        <i class="el-icon-picture-outline"></i>
                                    </div>
                                </el-image>
                            </div>
                            
                            <div class="user-info-name" align="center" :title="image.name">{{ image.name | filterImageName }}</div>

                            <el-button type="text" icon="el-icon-edit" @click="toAnnotationPage(index, image)"> 修改 </el-button>
                            <el-button type="text" icon="el-icon-delete" class="red" @click="handleDelete(index, image)">删除 </el-button>
                        </div>
                    </div>
                </div>
            </el-card>
            <div class="pagination" v-if="houseShowByImage">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="pageIndex"
                    :page-size="pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                >
                </el-pagination>
            </div>
        </div>

        <!-- 添加单张房间（隐藏表单）-->
        <div>
            <!-- 编辑弹出框 -->
            <el-dialog title="添加房间" :visible.sync="editVisible" width="40%">
                <el-form ref="form" :model="uploadRoomForm" label-width="70px">
                    <el-form-item label="用户ID" v-show="false">
                        <el-input v-model="uploadRoomForm.user_id" :disabled="true" ></el-input>
                    </el-form-item>

                    <el-form-item label="项目ID" v-show="false">
                        <el-input v-model="uploadRoomForm.project_id" :disabled="true"></el-input>
                    </el-form-item>

                    <el-form-item label="户型ID">
                        <el-input v-model="uploadRoomForm.house_id" :disabled="true"></el-input>
                    </el-form-item>

                    
                    <el-form-item label="房间名称">
                        <el-input v-model="uploadRoomForm.room_name"></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="当前类别">
                        <el-select v-model="uploadRoomForm.current_class" placeholder="请选择类别">
                            <el-option label="暂无类别" value=""></el-option>
                            <el-option v-for="(item, index) in classesData" :key="index" :label="item.name" :value="item.name">
                            </el-option>
                        </el-select>
                    </el-form-item> -->

                    <el-form-item label="创建类型">
                        <el-radio-group v-model="uploadRoomForm.upload_type">
                            <el-radio :label="0">空白房间</el-radio>
                            <el-radio :label="1">标准房间</el-radio>
                            <el-radio :label="2">房间文件</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <div v-if="uploadRoomForm.upload_type === 0">

                    </div>

                    <div v-if="uploadRoomForm.upload_type === 1">
                        <el-form-item label="房间宽度">
                        <el-input v-model="uploadRoomForm.room_width"></el-input>
                    </el-form-item>

                    
                    <el-form-item label="房间高度">
                        <el-input v-model="uploadRoomForm.room_height"></el-input>
                    </el-form-item>
                    </div>

                    <div v-if="uploadRoomForm.upload_type === 2">
                        <el-form-item label="上传房间">
                            <input type="file" id="file1" />
                        </el-form-item>
                    </div>

                    
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit('file1')">确 定</el-button>
                </span>
            </el-dialog>
        </div>
 
        <!--批量添加房间-->
        <el-dialog title="批量添加" :visible.sync="showhouseImage">
            <div class="batchAdd-panel">
                <div class="form-panel">
                    <el-form ref="addImageFrom" :model="houseForm" label-width="80px">
                        <el-form-item label="用户id">
                            <el-input v-model="houseForm.user_id" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="所属项目">
                            <el-select v-model="houseForm.project_id" placeholder="请选择" @change="changehouses" disabled>
                                <el-option
                                    v-for="(project, index) in userProjects"
                                    :key="index"
                                    :label="project.name + '(' + project.id + ')'"
                                    :value="project.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="项目类型">
                            <el-radio-group v-model="houseForm.project_mission" disabled>
                                <el-radio :label="1" :value="1" style="margin-bottom: 5px;">地板铺装任务</el-radio>
                                <el-radio :label="2" :value="2" style="margin-bottom: 5px;"> 扩展任务1 </el-radio>
                                <el-radio :label="3" :value="3" style="margin-bottom: 5px;"> 扩展任务2       </el-radio>
                                <el-radio :label="4" :value="4" style="margin-bottom: 5px;"> 扩展任务3 </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="户型">
                            <el-select v-model="houseForm.house_id" placeholder="请选择" disabled>
                                <el-option
                                    v-for="(house, index) in userhouses"
                                    :key="index"
                                    :label="house.name + '(' + house.id + ')'"
                                    :value="house.id"
                                >
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <template v-if="isDetect">
                            <el-form-item label="数据格式">
                                <el-radio-group v-model="labelType">
                                    <el-radio v-for="(item, index) in labelList" :label="item.label" :key="index" class="type-radio"
                                        >{{ item.name }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>
                        <template v-if="isDivide">
                            <el-form-item label="数据格式">
                                <el-radio-group v-model="labelType">
                                    <el-radio v-for="(item, index) in divideLabelList" :label="item.label" :key="index" class="type-radio"
                                        >{{ item.name }}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>
                        <template v-if="isVideo">
                            <el-form-item label="切片大小">
                                <el-radio-group v-model="labelType">
                                    <el-radio v-for="(item, index) in divideTimeList" :label="item" :key="index" class="type-radio"
                                        >{{ item }}秒
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </template>
                        <el-form-item label="上传文件">
                            <div id="app">
                                <!-- 上传组件 -->
                                <el-upload action drag :auto-upload="false" :show-file-list="false" :on-change="handleChange">
                                    <i class="el-icon-upload"></i>
                                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                                    <div class="el-upload__tip">请上传Zip格式文件</div>
                                </el-upload>
                                <!-- 进度显示 -->
                                <div class="progress-box">
                                    <span>上传进度：{{ percent.toFixed() }}%</span>
                                    <!--<el-button type="primary" size="mini" @click="handleClickBtn">{{ upload | btnTextFilter }}
                                    </el-button>-->
                                </div>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="info-panel">
                    <div class="info-title" v-if="project_mission == 1">【图像分类户型格式】</div>
                    <div class="info-title" v-if="project_mission == 2">【图像检测户型格式】</div>
                    <div class="info-title" v-if="project_mission == 3">【图像分割户型格式】</div>
                    <div class="info-title" v-if="project_mission == 4">【视频分类户型格式】</div>
                    <div class="info-contain">
                        <!-- <img :src="require('@assets/img/dataset/file_tree.png')" v-if="project_mission == 1"/>
                        <img :src="require('@assets/img/dataset/annotation_tree.png')" v-if="project_mission == 2"/> -->
                        <div class="info-content">
                            <div class="info-text" v-if="project_mission == 1">
                                【注意】class_name为文件夹，代表一个类别 file为房间文件，将同类别的房间放在对应的文件夹中，
                                压缩包解压后根目录为各类别文件夹。
                            </div>
                            <div class="info-text" v-if="project_mission == 2">
                                【注意】所有的房间和标签文件放在同一个文件夹中，保证房间名和标签文件名除后缀外名称相同。
                                VOC格式后缀为xml，Json格式后缀为json，cxyxy格式后缀为txt。
                                在当前数据文件夹将所有数据进行压缩，解压后直接为所有数据。
                            </div>
                            <br />
                            <div class="info-text">
                                若您的户型没有标注，可以直接上传房间压缩包， 即解压后均是房间文件，不用建立{{
                                    project_mission == 1 ? '类别' : '标签'
                                }}文件夹。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>

        <el-dialog title="导出户型" :visible.sync="showDownloadhouse" width="40%" :before-close="handleClose">
            <el-form ref="downloadhouse" :rules="rules" :model="downloadhouseForm" label-width="90px">
                <el-form-item label="项目">
                    <el-input v-model="downloadhouseForm.project" disabled></el-input>
                </el-form-item>
                <el-form-item label="户型">
                    <el-input v-model="downloadhouseForm.house" disabled></el-input>
                </el-form-item>
                <el-form-item label="户型类型">
                    <el-radio-group v-model="downloadhouseForm.house_mission" disabled>
                        <el-radio :label="1" :value="1">图像分类户型</el-radio>
                        <el-radio :label="2" :value="2">图像检测户型</el-radio>
                        <el-radio :label="3" :value="3">图像分割户型</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="导出格式" prop="download_format">
                    <el-radio-group v-if="this.project_mission == 1" v-model="downloadhouseForm.download_format">
                        <el-radio :label="'txt'">txt</el-radio>
                        <el-radio :label="'csv'">csv</el-radio>
                        <el-radio :label="'excel'">excel</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="this.project_mission == 2" v-model="downloadhouseForm.download_format">
                        <el-radio :label="'voc'">voc(.xml)</el-radio>
                        <el-radio :label="'json'">json</el-radio>
                        <el-radio :label="'cxyxy'">cxyxy</el-radio>
                        <el-radio :label="'yolo'">yolo</el-radio>
                    </el-radio-group>
                    <el-radio-group v-if="this.project_mission == 3" v-model="downloadhouseForm.download_format">
                        <el-radio :label="'json'">json</el-radio>
                        <el-radio :label="'mask'">mask</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="导出方式" prop="download_way">
                    <el-radio-group v-model="downloadhouseForm.download_way">
                        <el-radio :label="0">仅标签</el-radio>
                        <el-radio :label="2"
                            >仅房间
                            <el-tooltip effect="dark" content="导出可能需要长时间等待" placement="top">
                                <span class="el-icon-question"></span>
                            </el-tooltip>
                        </el-radio>
                        <el-radio :label="1"
                            >导出标签和房间
                            <el-tooltip effect="dark" content="导出可能需要长时间等待" placement="top">
                                <span class="el-icon-question"></span>
                            </el-tooltip>
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="导出范围" prop="download_range">
                    <el-radio-group v-model="downloadhouseForm.download_range">
                        <el-radio :label="0">仅导出已标注</el-radio>
                        <el-radio :label="1">全部导出</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancelDownloadhouse()">取 消</el-button>
                <el-button type="primary" @click="submitDownloadhouse()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import axios from 'axios';
import {
    getHouseById,
    // gethousesByProjectIdForList,
    // getFuzzyImageDataByName,
    // getClassifyhouseClasses,
    // unzipFileApi,
    // getDetectLabel,
    // getClassesNameByhouseId,
    getImageByPath,
    getThumbnailByPath,
    // exportImageDataLabels,
    // getSegmentImageWithLabel,
	// saveClass,
	// saveImageClass
} from '@/api/HouseManage.js';

import {getFuzzyRoomByHouse, deleteRoomById} from '@/api/RoomManage.js';

import SparkMD5 from 'spark-md5';
import { getRandomColor, hexToRgb } from '@utils/common.js';
// import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';

export default {
    name: 'houseDetail',
    data() {
        return {
            itemKey: true,
            // old
            user_id: localStorage.getItem('ms_user_id'),
            house_id: localStorage.getItem('ms_house_id'), //户型ID
            project_id: localStorage.getItem('ms_project_id'), //项目ID

            pageIndex: 1, //户型房间展示表格-页码
            pageSize: 12, //户型房间展示表格-页大小
            pageTotal: 0, //户型房间展示表格-总数

            main_image: '', //户型封面

            tablehouseData: [
                {
                    id: '',
                    name: '',
                    mission: 1,
                    create_date: '',
                    last_date: '',
                    class_num: 3,
                    image_num: 0
                }
            ], //户型详情表格

            classesData: [], //分类户型-类别下拉框
            houseShowByList: true, //户型房间列表展示/缩略展示
            houseShowByImage: false, //缩略图模式显示
            editVisible: false, //添加房间弹框
            uploadRoomForm: {
                user_id: localStorage.getItem('ms_user_id'),
                project_id: localStorage.getItem('ms_project_id'),
                house_id: localStorage.getItem('ms_house_id'),
                room_name: '',
                upload_type: 0,
                room_width: 1000,
                room_height: 1000,
            }, //房间上传表单
            roomList: [], //户型房间列表
            project_mission: '1', //户型-项目类别
            showDetectImageDetail: false, //检测房间详情
            showDivisionImageDetail: false, //分割房间详情
            showDetectImageUrl: '', //标注原始房间
            showDivisionImageUrl: '', // 标注分割房间
            //showDivisionImageList: [], // 分割标注房间列表
            showDetectImageLabels: [], //标注标签
            showhouseImage: false, //批量添加弹框
            showDownloadhouse: false, // 导出户型弹框
            houseForm: {
                user_id: localStorage.getItem('ms_user_id'),
                project_id: '',
                project_mission: 1,
                house_id: ''
            }, //批量添加表单
            downloadhouseForm: {
                project: '',
                house: '',
                house_mission: '',
                download_format: '',
                download_way: 0,
                download_range: 0
            }, // 导出户型
            rules: {
                download_format: [{ required: true, message: '请选择导出格式', trigger: 'change' }],
                download_way: [{ required: true, message: '请选择导出方式', trigger: 'change' }],
                download_range: [{ required: true, message: '请选择导出范围', trigger: 'change' }]
            },
            userProjects: [], //批量上传项目下拉框
            userhouses: [], //批量上传户型下拉框
            isDetect: false, //批量添加判断是否是检测
            isDivide: false, //批量添加判断是否是分割
            isVideo: false,
            percent: 0, //批量添加进度条
            percentCount: 0, //批量添加进度条
            upload: true,
            chunkList: [], //分片数组
            chunkSize: 2097152, //分片大小
            curChunk: 0, //当前分片
            hash: '', //hash值
            detail: '未上传数据',
            labelType: 1,
            searchRoomName: '', //户型搜索-房间名称
            searchIsLabel: '', //户型搜索-房间类别
            loading: '',
            classList: [], //所有标注标签类别，格式化的标签类别（有随机颜色）
            classs: [], //所有标注标签类别
            controlInfo: {
                imageGroup: {
                    supplementIndex: 0
                }
            },
            current_image_num: 1, //当前显示的房间索引
            total_image_num: 1, //分割户型-房间总量
            curImgName: '', // 当前分割房间名称
            curClassName: '', // 当前分割房间标签名称
            current_image: '', //当前选中的房间
            img_data_list: [], //分割房间户型

			showUpdateLayout: false, // 类别修改模块
			newSelectClassName: '',
			editNewClass: 'newClass',
        };
    },
    filters: {
        btnTextFilter(val) {
            return val ? '暂停' : '继续';
        },
        filterImageName(val) {
            if (val.length > 20) {
                return val.substring(0, 20) + '...';
            } else {
                return val;
            }
        }
    },
    created() {
        this.getData();
        this.handleRoomSearch();
    },
    mounted() {
        let _this = this;
        this._onResize = function () {
            _this.WindowOnresize();
        };
        window.addEventListener('resize', this._onResize);
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._onResize);
        this._onResize = null;
    },
    methods: {
        //卡片模式展示房间自适应
        async WindowOnresize() {
            let imageCardCount = this.roomList.length;
            if (imageCardCount > 0) {
                let imageCardGroup = this.$refs['imageCardGroup'];
                // 解决打开户型详情页面时，其他界面报错问题
                if(imageCardGroup != 'undefined' && imageCardGroup){
                    let imageCardGroupWidth = imageCardGroup.getBoundingClientRect().width;
                    let unitImageCardWidth = this.$refs['imageCardItem0'][0].getBoundingClientRect().width;
                    let rowCount = parseInt(imageCardGroupWidth / unitImageCardWidth);
                    let supplementIndex = rowCount - (imageCardCount % rowCount);
                    let appendCardGroup = document.getElementsByClassName('append-card');
                    let appendCount = appendCardGroup.length;
                    if (appendCardGroup) {
                        for (let j = 0; j < appendCount; j++) {
                            await imageCardGroup.removeChild(appendCardGroup[0]);
                        }
                    }
                    if (supplementIndex != rowCount) {
                        for (let i = 0; i < supplementIndex; i++) {
                            let appendBody = document.createElement('div');
                            appendBody.style.flex = '1';
                            appendBody.style.maxWidth = unitImageCardWidth + 'px';
                            appendBody.className = 'append-card';
                            imageCardGroup.appendChild(appendBody);
                        }
                    }
                    this.$nextTick(() => {
                        const imgDomList = document.querySelectorAll('.image-list-main');
                        imgDomList.length &&
                            imgDomList.forEach((item) => {
                                item.style.maxWidth = unitImageCardWidth + 'px';
                            });
                    });
                }
            }
        },
        // 数字格式修改
        formatNumberWithCommas(row, column, cellValue) {
            // 处理可能的 null 或 undefined 值
            if (cellValue == null) return '';
            
            // 将数字转换为字符串并添加千位分隔符
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
            // return Number(cellValue).toLocaleString('en-US');
        },
        //查看详情页信息
        getData() {
            console.log("getData iner")
            let params = {
                user_id: this.user_id,
                house_id: this.house_id
            };
            getHouseById(params)
            .then((res) => {
                let { data, status, msg } = res;
                if (status == 200) {
                    this.tablehouseData = [];
                    // 将project_id存储在localStorage中
                    localStorage.setItem('ms_project_id', data.project_id);
                    this.project_id = data.project_id;
                    this.tablehouseData.push(data);
                    this.downloadhouseForm.project = `${data.project_name}(${this.project_id})`;
                    this.downloadhouseForm.house = `${data.name}(${data.id})`;
                    this.project_mission = data.project_type; //户型类型
                    this.main_image = data.image; //户型房间

                } else {
                    this.$message.error('查询户型详情失败:' + msg);
                }
            })
            .catch((error) => {
                this.$message.error('查询户型详情失败！');
            });
        },
        //房间路径
        getImagePath(image_name) {
            return this.$serverUrl + image_name;
        },
        // 绘制检测任务户型房间
        getDetectImageWithLabel(id) {
            let params = {
                user_id: this.user_id,
                house_id: this.house_id,
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
        //点击户型房间查询按钮
        handleSearch() {
            this.pageIndex = 1;
            this.handleRoomSearch();
        },
        //查询房间信息
        handleRoomSearch() {
            let params = {
                house_id: this.house_id,
                room_name: this.searchRoomName, //房间名
                is_label: this.searchIsLabel, // 是否已经标注

                page_index: this.pageIndex,
                page_size: this.pageSize
            };
            console.log("GOGOGO")
            
            getFuzzyRoomByHouse(params)
                .then(async (res) => {
                    let { data, status, msg, total } = res;
                    if (status == 200) {
                        this.pageTotal = total;
                        this.roomList = [];
                        
                        for (let i = 0; i < data.length; i++) {
                            this.roomList.push(await this.getThumb(data[i]));
                            // this.roomList.push(data[i]);

                            this.roomList[i].imageUrl = this.getImagePath(this.roomList[i].image_path);

                            // getImageByPath({image_path: this.roomList[i].image_path}).then((res) => {
                            //     let { data, msg, status } = res;
                            //     this.roomList[i].imageUrl =  data;
                            // });
                            
                            // if (this.houseShowByImage) {
                            //     let _this = this;
                            //     this.$nextTick(() => {
                            //         _this.WindowOnresize();
                            //     });
                            // }
                        }
                        // this.itemKey = !this.itemKey;
                    } else {
                        this.$message.error(`查询户型中房间信息失败：${msg}!`);
                    }
                })
                .catch((error) => {
                    this.$message.error('查询户型中房间信息失败!');
                });
        },
        //通过房间路径查询房间
        async getThumb(item) {
            let params = {
                image_path: item.image_path
            };
            item.thumbUrl = await getThumbnailByPath(params).then((res) => {
                let { data, msg, status } = res;
                return data;
            });
            return item;
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('删除后无法恢复，确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    let params = {
                        user_id: this.user_id,
                        room_id: row.id
                    };
                    deleteRoomById(params)
                        .then((res) => {
                            this.handleRoomSearch();
                            this.$message.success('删除成功!');
                        })
                        .catch((error) => {
                            this.$message.success('删除失败!');
                        });
                })
                .catch(() => {
                    this.$message.info('取消删除!');
                });
        },
        // 切换展示模式
        convertListAndImage() {
            if (this.houseShowByList === true) {
                this.houseShowByList = false;
                this.houseShowByImage = true;
            } else {
                this.houseShowByList = true;
                this.houseShowByImage = false;
            }
            if (this.houseShowByImage) {
                let _this = this;
                this.$nextTick(() => {
                    _this.WindowOnresize();
                });
            }
        },
        // 户型房间分页导航
        handlePageChange(val) {
            this.pageIndex = val;
            this.handleRoomSearch();
        },
        // 跳转至标注页面
        toAnnotationPage(index, row) {
			console.log("this.project_mission: " + this.project_mission);
			
            this.$router.push({
                path: '/toUserHouseAnnotationPage',
                query: { house_id: this.house_id, index_by_id: row.id, project_mission: this.project_mission }
            });
        },
        // 户型——添加房间
        addOneImage() {
            this.editVisible = true;
        },
        //户型——添加房间提交
        onSubmit(id) {
            let formData = new FormData();
            
            formData.append('user_id', this.uploadRoomForm.user_id);
            formData.append('project_id', this.uploadRoomForm.project_id);
            formData.append('house_id', this.uploadRoomForm.house_id);
            formData.append('room_name', this.uploadRoomForm.room_name);

            formData.append('room_width', this.uploadRoomForm.room_width);
            formData.append('room_height', this.uploadRoomForm.room_height);

            formData.append('upload_type', this.uploadRoomForm.upload_type);

            const loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });


            if(this.uploadRoomForm.upload_type == 2){
                formData.append('file', document.getElementById(id).files[0]);
                formData.append('file_name', document.getElementById(id).files[0].name);

                axios({
                        url: this.$serverUrl + 'uploadOneRoom',
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: formData
                    }).then((res) => {
                        if (res.data.status === 200) {
                            // 成功
                            this.$message.success('房间添加成功');
                            this.editVisible = false;
                            this.getData();
                            this.handleRoomSearch();
                        } else {
                            this.$message.error('添加失败！' + res.data.msg);
                        }
                        loading.close()
                    });
            } else {
                axios({
                        url: this.$serverUrl + 'uploadOneRoom',
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: formData
                    }).then((res) => {
                        if (res.data.status === 200) {
                            // 成功
                            this.$message.success('房间添加成功，请上传标签或及时标注！');
                            this.editVisible = false;
                            this.getData();
                            this.handleRoomSearch();
                        } else {
                            this.$message.error('添加失败！' + res.data.msg);
                        }
                        loading.close()
                    });
            }
        },
        //导出户型
        // submitDownloadhouse() {
        //     this.$refs['downloadhouse'].validate((valid) => {
        //         if (valid) {
        //             let params = {
        //                 userId: this.user_id,
        //                 houseId: this.house_id,
        //                 exportLabelType: this.downloadhouseForm.download_format,
        //                 includeImagesAndLabels: this.downloadhouseForm.download_way,
        //                 includeWithoutLabel: this.downloadhouseForm.download_range
        //             };
        //             const loading = this.$loading({
        //                 lock: true,
        //                 text: 'Loading',
        //                 spinner: 'el-icon-loading',
        //                 background: 'rgba(0, 0, 0, 0.7)'
        //             });
        //             exportImageDataLabels(params)
        //                 .then((res) => {
        //                     let { status, msg, data } = res;
        //                     loading.close();
        //                     if (status === 200) {
        //                         this.$confirm('下载户型？', '', {
        //                             customClass: 'downloadConfirm'
        //                         }).then(() => {
        //                             let url = `${this.$serverUrl}${data}`;
        //                             window.open(url);
        //                             this.cancelDownloadhouse();
        //                         });
        //                     }
        //                 })
        //                 .catch((error) => {
        //                     this.$message.error('下载失败!');
        //                 });
        //         }
        //     });
        // },
        //批量添加
        handlMultipleImage() {
            if (this.project_mission == 2) {
                this.isDetect = true;
                this.isDivide = false;
                this.isVideo = false;
            } else if (this.project_mission == 3) {
                this.isDetect = false;
                this.isDivide = true;
                this.isVideo = false;
            } else if (this.project_mission == 4) {
                this.isDetect = false;
                this.isDivide = false;
                this.isVideo = true;
            }
            this.showhouseImage = true;
            this.percent = 0;
            this.houseForm.project_id = parseInt(this.project_id);
            this.houseForm.house_id = parseInt(this.house_id);
            this.houseForm.project_mission = this.project_mission;
        },
        // 导出户型
        downLoadhouse(type) {
            this.showDownloadhouse = true;
            this.downloadhouseForm.house_mission = this.project_mission;
            this.downloadhouseForm.download_format = type;
        },
        // 取消导出户型弹框
        cancelDownloadhouse() {
            this.showDownloadhouse = false;
            this.initDownloadhouseForm();
        },
        // 初始化户型表单
        initDownloadhouseForm() {
            this.downloadhouseForm.download_format = 'txt';
            this.downloadhouseForm.download_way = 0;
            this.downloadhouseForm.download_range = 0;
        },
        // 点击完下载后，开始下载并初始化导出户型表单
        inithouseForm() {
            this.cancelDownloadhouse();
        },
        // 手动关闭导出户型对话框
        handleClose(done) {
            this.cancelDownloadhouse();
            done();
        },
        changehouses() {
            // 获取当前选择的项目信息
            for (let i = 0; i < this.userProjects.length; i++) {
                if (this.houseForm.project_id == this.userProjects[i].id) {
                    this.selectProject = i;
                    break;
                }
            }
            // 更新数据类型
            this.houseForm.project_mission = this.userProjects[this.selectProject].mission;
            // 如果为检测项目，则需要选择户型类型
            if (this.userProjects[this.selectProject].mission == 2) {
                this.isDetect = true;
                this.isDivide = false;
                this.isVideo = false;
            } else if (this.userProjects[this.selectProject].mission == 3) {
                this.isDetect = false;
                this.isDivide = true;
                this.isVideo = false;
            } else if (this.userProjects[this.selectProject].mission == 4) {
                this.isDetect = false;
                this.isDivide = false;
                this.isVideo = true;
            }
        },
        async handleChange(file) {
            if (!file) return;
            let FileExt = file.name.replace(/.+\./, '');
            if (['zip'].indexOf(FileExt.toLowerCase()) === -1) {
                this.$message({
                    type: 'warning',
                    message: '上传格式不符合要求，请上传Zip格式!'
                });
                return false;
            }
            this.loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // 获取文件并转成 ArrayBuffer 对象
            const fileObj = file.raw;
            let buffer;
            try {
                buffer = await this.fileToBuffer(fileObj);
            } catch (e) {
                console.log(e);
            }
            // 将文件按固定大小（2M）进行切片，注意此处同时声明了多个常量
            let chunkListLength = Math.ceil(fileObj.size / this.chunkSize);
            let suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1]; // 文件后缀名
            // 根据文件内容生成 hash 值
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(buffer);
            this.hash = spark.end();
            // 请求后端，判断是否具有缓存
            // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
            //首先进行初始化
            this.chunkList = [];
            this.curChunk = 0;
            for (let i = 0; i < chunkListLength; i++) {
                const item = {
                    chunk: fileObj.slice(this.curChunk, this.curChunk + this.chunkSize),
                    fileName: `${this.hash}_${i}.${suffix}` // 文件名规则按照 hash_1.jpg 命名
                };
                this.curChunk += this.chunkSize;
                this.chunkList.push(item);
            }
            this.sendRequest();
        },
        // 将 File 对象转为 ArrayBuffer
        fileToBuffer(file) {
            return new Promise((resolve, reject) => {
                const fr = new FileReader();
                fr.onload = (e) => {
                    resolve(e.target.result);
                };
                fr.readAsArrayBuffer(file);
                fr.onerror = () => {
                    reject(new Error('转换文件格式发生错误'));
                };
            });
        },
        unzipFile() {
            this.detail = '开始解压户型...';
            let params = {
                hash: this.hash,
                user_id: this.houseForm.user_id,
                project_id: this.houseForm.project_id,
                house_id: this.houseForm.house_id,
                labelType: this.labelType
            };
            unzipFileApi(params)
                .then((res) => {
                    let { msg, status, data } = res;
                    if (status == 200) {
                        this.detail = msg;
                        this.getData();
                        this.getClassesName();
                        this.showhouseImage = false;
                        this.loading.close();
                        this.$message({
                            type: 'success',
                            message: `解压成功率${data.success_rate}%,出错数:${data.error},总数:${data.total}`,
                            duration: 4000
                        });
                    } else {
                        this.loading.close();
                        this.$message.error('解压失败:' + msg);
                    }
                })
                .catch((error) => {
                    this.loading.close();
                    this.$message.error('解压失败！');
                });
        },
        // 按下暂停按钮
        handleClickBtn() {
            this.upload = !this.upload;
            // 如果不暂停则继续上传
            if (this.upload) this.sendRequest();
        },
        // 发送请求
        sendRequest() {
            const requestList = []; // 请求集合
            this.chunkList.forEach((item, index) => {
                const fn = () => {
                    const formData = new FormData();
                    formData.append('chunk', item.chunk);
                    formData.append('filename', item.fileName);
                    formData.append('hash', this.hash);
                    formData.append('user_id', this.houseForm.user_id);
                    formData.append('project_id', this.houseForm.project_id);
                    formData.append('house_id', this.houseForm.house_id);
                    return axios({
                        url: this.$serverUrl + 'uploadChunk',
                        method: 'post',
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        data: formData
                    }).then((res) => {
                        if (res.data.status === 200) {
                            // 成功
                            if (this.percentCount === 0) {
                                // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
                                this.percentCount = (100 - this.percent) / this.chunkList.length;
                            }
                            this.percent += this.percentCount; // 改变进度
                            this.chunkList.splice(index, 1); // 一旦上传成功就删除这一个 chunk，方便断点续传
                        } else if (res.data.status === 500) {
                            this.percent = 100;
                        }
                    });
                };
                requestList.push(fn);
            });
            let i = 0; // 记录发送的请求个数
            // 文件切片全部发送完毕后，需要请求 '/merge' 接口，把文件的 hash 传递给服务器
            const complete = () => {
                axios({
                    url: this.$serverUrl + 'mergeChunk',
                    method: 'POST',
                    data: {
                        hash: this.hash,
                        user_id: this.houseForm.user_id,
                        project_id: this.houseForm.project_id,
                        house_id: this.houseForm.house_id
                    }
                }).then((res) => {
                    this.detail = res.data.msg;
                    if (res.data.status === 200) {
                        this.unzipFile();
                        this.$message.success(this.detail);
                    }
                });
            };

            const send = async () => {
                if (!this.upload) return;
                if (i >= requestList.length) {
                    // 发送完毕
                    complete();
                    return;
                }
                await requestList[i]();
                i++;
                send();
            };
            send(); // 发送请求
        },
        //查询所有类别
        getClassesName() {
            let params = {
                user_id: this.user_id,
                house_id: this.house_id
            };
            getClassesNameByhouseId(params).then((res) => {
                let { status, msg, data } = res;
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
        },
        // 切换上一张房间
        toPreImage() {
            this.current_image_num = this.current_image_num - 1 > 0 ? this.current_image_num - 1 : this.total_image_num;
            this.current_image = this.img_data_list[this.current_image_num - 1];
            if (this.current_image.class_name) {
                this.curClassName = this.current_image.class_name;
            } else {
                this.curClassName = '暂无类别';
            }
            this.showDivisionImageUrl = this.current_image.file_path;
            this.$refs.divisionCanvas.getImageBase64(this.showDivisionImageUrl).then(() => {
                this.$refs.divisionCanvas.initImage();
            });
        },
        // 切换下一张房间
        toNextImage() {
            this.current_image_num = (this.current_image_num % this.total_image_num) + 1;
            this.current_image = this.img_data_list[this.current_image_num - 1];
            if (this.current_image.class_name) {
                this.curClassName = this.current_image.class_name;
            } else {
                this.curClassName = '暂无类别';
            }
            this.showDivisionImageUrl = this.current_image.file_path;
            this.$refs.divisionCanvas.getImageBase64(this.showDivisionImageUrl).then(() => {
                this.$refs.divisionCanvas.initImage();
            });
        },
        // 关闭详细图像对话框后默认显示第一张房间
        handleCloseDivision() {
            this.showDivisionImageDetail = false;
            this.current_image_num = 1;
            this.current_image = this.img_data_list[0];
            this.showDivisionImageUrl = this.current_image.file_path;
            this.curClassName = this.current_image.class_name;
        }
    }
};
</script>

<style scoped lang="less">
.project-message {
    margin-left: 8px;
    width: 78%;
    float: left;
}

.image-panel {
    display: flex;
    flex-flow: wrap;
    justify-content: flex-start;
}

.image-list-main {
    flex: 1;
    max-width: 268px;
}

.image-list-div {
    border: 1px dashed gray;
    text-align: center;
    margin: 0px -1px -1px 0px;
}

.image-list-image {
    width: 210px;
    height: 140px;
    margin: 0 auto;
    padding: 10px;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 80px;
    height: 80px;
}

.image-load {
    background: #f5f7fa;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #c0c4cc;
    vertical-align: middle;
}
.search-input {
    margin: 0 10px 0 20px;
    width: 200px;
}

.search-select {
    margin-left: 20px;
}

.batchAdd-panel {
    display: flex;

    .form-panel {
        flex: 1;
    }

    .info-panel {
        flex: 1;
        padding: 0 20px;

        .info-title {
            font-size: 16px;
            margin-bottom: 20px;
            font-weight: bold;
        }

        .info-contain {
            display: flex;
            flex-wrap: wrap;

            .info-content {
                flex: 1;
            }

            .info-text {
                font-size: 14px;
                line-height: 26px;
            }
        }
    }
}

.type-radio {
    margin-bottom: 10px;
}

.rz-picter {
    height: 500px;
}

.house-detail {
    margin-bottom: 10px;

    .detail-info {
        display: flex;

        .project-main {
            width: 240px;
            height: 240px;
            border: 1px dashed #000;
            padding: 10px;
        }

        .project-main-img {
            width: 100%;
            height: 100%;
        }

        .project-message {
            flex: 1;
        }
    }
}
.pageControl {
    width: 100%;
    height: 60px;
    text-align: center;
}

.pageControl .pageSwitch {
    width: 36px;
    height: 36px;
    margin-top: 12px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    display: inline-block;
    cursor: pointer;
}
.inline-block {
    display: inline-block;
    vertical-align: top;
}
.toolHead {
    width: 100%;
    background: -webkit-linear-gradient(left, #2b334a, #27405d); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(right, #2b334a, #27405d); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(right, #2b334a, #27405d); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, #2b334a, #27405d); /* 标准的语法 */
    height: 60px;
    position: relative;
}

.toolHead .toolMuster {
    width: 100%;
    height: 100%;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    position: relative;
}
.pageControl .pageInfo .pageName {
    margin-top: 6px;
    font-size: 14px;
    width: 100%;
    height: 20px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
.pageControl .pageInfo .nameProcess {
    margin-top: 5px;
    font-size: 12px;
}
.parent {
    position: relative;
    height: 54px;
}
.child {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
}
</style>

<style lang="less">
.downloadConfirm {
    .el-message-box__btns {
        .el-button:nth-child(2) {
            background-color: #409eff;
            border-color: #409eff;
        }
    }
}
</style>
