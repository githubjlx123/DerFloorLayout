<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-calendar"></i> 铺装管理 </el-breadcrumb-item>
                <el-breadcrumb-item>铺装模拟</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div style="width: 90%;margin: auto;margin-top: 25px">
            <el-steps :active="active" finish-status="success" align-center simple>
                <el-step title="1 — 选择户型" description="选择铺装模拟户型"></el-step>
                <el-step title="2 — 配置参数" description="设置铺装参数"></el-step>
                <el-step title="3 — 确认配置" description="查看铺装模拟结果"></el-step>
                <el-step title="4 — 查看结果" description="保存铺装模拟方案">></el-step>
            </el-steps>  
        </div>

        <div class="container" style="margin-top: 10px;">
            <!-- 步骤1：选择户型 -->
            <div v-if="active == 0" style="display: flex;">

                <div style="width: 40%;">
                    <el-form ref="form" :model="floorPaveForm" label-width="120px">
                        <el-form-item label="用户id" prop="id">
                            <el-input v-model="floorPaveForm.user_id" :disabled="true"></el-input>
                        </el-form-item>

                        <el-form-item label="选择项目" prop="project_id">
                            <el-select
                                v-model="floorPaveForm.project_id"
                                placeholder="请选择"
                                class="select-length"
                            >
                                <div v-for="project in userProjects" :key="project.id">
                                    <el-option :key="project.name" :label="project.name + '(' + project.id + ')'" :value="project.id">
                                    </el-option>
                                </div>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="任务类型" prop="project_mission">
                            <el-radio-group v-model="floorPaveForm.project_mission" disabled>
                                
                                <el-radio :label="'1'" :value="'1'">常规铺装项目</el-radio>
                                <el-radio :label="'2'" :value="'2'">整体铺装项目</el-radio>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item label="选择户型" prop="house_id">
                            <el-select
                                v-model="floorPaveForm.house_id"
                                placeholder="请选择"
                                class="select-length"
                            >
                                <div v-for="house in userHouses" :key="house.id">
                                    <el-option :key="house.name" :label="house.name + '(' + house.id + ')，房间数量：' + house.count" :value="house.id">
                                    </el-option>
                                </div>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="铺装名称" prop="plan_name" class="select-length">
                            <el-input v-model="floorPaveForm.plan_name"></el-input>
                        </el-form-item>

                        <el-form-item label="地板长度" prop="floor_width" class="select-length">
                            <el-input v-model="floorPaveForm.floor_width" type="number" maxLength="3" placeholder="单位(mm)"></el-input>
                        </el-form-item>

                        <el-form-item label="地板宽度" prop="floor_height" class="select-length">
                            <el-input v-model="floorPaveForm.floor_height" type="number" maxLength="3" placeholder="单位(mm)"></el-input>
                        </el-form-item>

                        <el-form-item label="铺装方法" prop="pave_method">
                            <el-select v-model="floorPaveForm.pave_method" placeholder="请选择" class="select-length">
                                <el-option :key="1" label="步步高铺装(369)" value="369"></el-option>
                                <el-option :key="2" label="四分步步高铺装(2468)" value="2468"></el-option>
                                <el-option :key="3" label="工字铺装" value="I"></el-option>
                                <el-option :key="4" label="人字铺装" value="H"></el-option>
                                <el-option :key="5" label="鱼骨铺装" value="F"></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="裁剪策略" prop="pave_optimizer">
                            <el-select v-model="floorPaveForm.pave_optimizer" placeholder="请选择" class="select-length">
                                <el-option :key="1" label="最大贪婪优化" value="1"></el-option>
                                <el-option :key="2" label="贪婪优化" value="2"></el-option>
                                <el-option :key="3" label="动态规划优化" value="3"></el-option>
                                <el-option :key="4" label="无优化" value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        
                        

                        <el-form-item label="铺装描述" prop="detail">
                            <el-input type="textarea" rows="3" v-model="floorPaveForm.detail"></el-input>
                        </el-form-item>

                        <div class="btn-group">
                            
                            <el-button  type="primary" style="margin-top: 1px;" @click="toNextStep">下一步</el-button>
                            <el-button @click="resetForm" >重置表单</el-button>
                        </div>
                    </el-form>
                </div>
                
                <div class="line"></div>

                <div style="width: 58%; border: 1px solid #ebeef5; padding: 20px; height: 100%;">
                    <!-- 未选择户型时的提示 -->
                    <div v-if="!floorPaveForm.house_id" class="empty-state">
                        <el-empty description="请先选择户型"></el-empty>
                    </div>

                    <!-- 未选择户型时的提示 -->
                    <div v-else-if="this.houseRooms.length <= 0" class="empty-state">
                        <el-empty description="该户型下暂无房间信息"></el-empty>
                    </div>

                     <!-- 户型下的房间的可视化展示区 -->
                     <div v-else class="house-visualization">
                        <div v-loading="roomLoading">
                            <!-- 房间信息展示区 -->
                            <div v-if="currentRoom()" class="room-container">
                            <!-- 房间基本信息 -->
                            <div class="room-header">
                                <h3>{{ currentRoom().name }} （面积: {{ formatNumberWithCommas(currentRoom().room_area) }}m㎡）</h3>
                            </div>
                            
                            <!-- 房间图片展示 -->
                            <div class="room-image-container" v-if="currentRoom().image_path">
                                <div class="room-image-wrapper">
                                    <el-image 
                                    :src="getImagePath(currentRoom().image_path)" 
                                    :preview-src-list="[getImagePath(currentRoom().image_path)]"
                                    fit="contain"
                                    style="width: 100%; display: block;"
                                    ></el-image>
                                </div>
                            </div>
                            
                            <!-- 分页控制 -->
                            <div class="room-pagination">
                                <el-button 
                                :disabled="currentRoomPage <= 1" 
                                @click="prevRoom"
                                icon="el-icon-arrow-left"
                                >上一间</el-button>
                                
                                <span class="page-info">{{ currentRoomPage }}/{{ houseRooms.length }}</span>
                                
                                <el-button 
                                :disabled="currentRoomPage >= houseRooms.length" 
                                @click="nextRoom"
                                >下一间
                                <i class="el-icon-arrow-right el-icon--right"></i>
                                </el-button>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                    
                </div>
            </div>

            <!-- 步骤2：配置参数 -->
            <div v-if="active == 1" style="display: flex;">
                <div style="width: 40%;">
                    <el-form ref="form" :model="floorPaveForm" label-width="120px">
                        
                        <el-form-item label="伸缩缝大小" prop="expand_size" class="select-length">
                            <el-input v-model="expand_size" type="number" maxLength="3"></el-input>
                        </el-form-item>

                        <el-form-item label="最大忽略" prop="max_ignore_size" class="select-length">
                            <el-input v-model="max_ignore_size" type="number" maxLength="3"></el-input>
                        </el-form-item>

                        <hr style="border: none; height: 1px; background-color: #EBEEF5;"><br>


                        <el-form-item label="房间配置" prop="room_id">
                            <el-select
                                v-model="floorPaveForm.room_id"
                                placeholder="选择查看"
                                class="select-length"
                            >
                                <div v-for="room in houseRooms" :key="room.id">
                                    <el-option :key="room.name" :label="room.name + '(' + room.id + ')'" :value="room.id"> </el-option>
                                </div>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="铺装起始_x" prop="current_start_x" class="select-length">
                            <el-input v-model="current_start_x" type="number" maxLength="3"></el-input>
                        </el-form-item>

                        <el-form-item label="铺装起始_y" prop="current_start_y" class="select-length">
                            <el-input v-model="current_start_y" type="number" maxLength="3"></el-input>
                        </el-form-item>

                        <el-form-item label="起始方向" prop="current_start_dir">
                            <el-select v-model="current_start_dir" placeholder="请选择" class="select-length">
                                <el-option :key="1" label="右上(↗)" value="1"></el-option>
                                <el-option :key="2" label="左上(↖)" value="2"></el-option>
                                <el-option :key="3" label="左下(↙)" value="3"></el-option>
                                <el-option :key="4" label="右下(↘)" value="4"></el-option>
                            </el-select>
                        </el-form-item>



                        <div class="btn-group">
                            
                            <el-button  type="primary" style="margin-top: 1px;" @click="toNextStep">下一步</el-button>
                            <el-button @click="toPreStep" >返回</el-button>
                            <el-button type="success" @click="saveCurrentRoomConfig">保存当前房间配置</el-button>
                        </div>
                    </el-form>
                </div>
                
                <div class="line"></div>

                <div style="width: 58%; border: 1px solid #ebeef5; padding: 20px; height: 100%;">
                    <!-- 未选择户型时的提示 -->
                    <div v-if="!floorPaveForm.house_id" class="empty-state">
                        <el-empty description="请先选择户型"></el-empty>
                    </div>

                    <!-- 未选择户型时的提示 -->
                    <div v-else-if="this.houseRooms.length <= 0" class="empty-state">
                        <el-empty description="该户型下暂无房间信息"></el-empty>
                    </div>

                     <!-- 户型下的房间的可视化展示区 -->
                     <div v-else class="house-visualization">
                        <div v-loading="roomLoading">
                            <!-- 房间信息展示区 -->
                            <div v-if="currentRoom()" class="room-container">
                            <!-- 房间基本信息 -->
                            <div class="room-header">
                                <h3>{{ currentRoom().name }} （面积: {{ formatNumberWithCommas(currentRoom().room_area) }}m㎡）</h3>
                            </div>
                            
                            <!-- 房间图片展示 -->
                            <div class="room-image-container" v-if="currentRoom().image_path">
                                <div class="room-image-wrapper">
                                    <el-image 
                                    :src="getImagePath(currentRoom().image_path)" 
                                    :preview-src-list="[getImagePath(currentRoom().image_path)]"
                                    fit="contain"
                                    style="width: 100%; display: block;"
                                    ></el-image>
                                </div>
                            </div>

                            <!-- 分页控制 -->
                            <div class="room-pagination">
                                <el-button 
                                :disabled="currentRoomPage <= 1" 
                                @click="prevRoom"
                                icon="el-icon-arrow-left"
                                >上一间</el-button>
                                
                                <span class="page-info">{{ currentRoomPage }}/{{ houseRooms.length }}</span>
                                
                                <el-button 
                                :disabled="currentRoomPage >= houseRooms.length" 
                                @click="nextRoom"
                                >下一间
                                <i class="el-icon-arrow-right el-icon--right"></i>
                                </el-button>
                            </div>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>

            <!-- 步骤3：查看配置 -->
            <div v-if="active == 2" style="display: flex;">
                <div style="width: 40%;">
                    <el-card class="box-card" shadow="hover" style="margin-left: 5%;">
                        <div slot="header" class="clearfix">
                            <span>铺装方案概览</span>
                        </div>
                        <el-descriptions :column="1" border>
                            <el-descriptions-item label="项目名称">
                                <!-- {{ userProjects.find(p => p.id === floorPaveForm.project_id)?.name || '未选择' }} -->
                                <!-- {{ selectedProject.name || '未选择' }} -->
                                  test
                            </el-descriptions-item>
                           <el-descriptions-item label="户型名称">
                                <!-- {{ userHouses.find(h => h.id === floorPaveForm.house_id)?.name || '未选择' }} -->
                                  test
                            </el-descriptions-item>
                            <el-descriptions-item label="铺装方案名称">
                                {{ floorPaveForm.plan_name || '未命名方案' }}
                            </el-descriptions-item>
                            <el-descriptions-item label="地板规格">
                                {{ floorPaveForm.floor_width }}mm × {{ floorPaveForm.floor_height }}mm
                            </el-descriptions-item>
                            <el-descriptions-item label="铺装方法">
                                {{ 
                                    {
                                        '369': '步步高铺装(369)',
                                        '2468': '四分步步高铺装(2468)',
                                        'I': '工字铺装',
                                        'H': '人字铺装',
                                        'F': '鱼骨铺装'
                                    }[floorPaveForm.pave_method] || '未选择'
                                }}
                            </el-descriptions-item>
                            <el-descriptions-item label="优化策略">
                                {{ 
                                    {
                                        '1': '最大贪婪优化',
                                        '2': '贪婪优化',
                                        '3': '动态规划优化',
                                        '4': '无优化'
                                    }[floorPaveForm.pave_optimizer] || '未选择'
                                }}
                            </el-descriptions-item>
                            <el-descriptions-item label="伸缩缝大小">
                                {{ expand_size || 0 }}mm
                            </el-descriptions-item>
                            <el-descriptions-item label="最大忽略尺寸">
                                {{ max_ignore_size || 0 }}mm
                            </el-descriptions-item>
                            <el-descriptions-item label="房间数量">
                                {{ houseRooms.length }}间
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-card>

                    
                    <div class="btn-group" style="margin-top: 20px;">
                        <el-button type="primary" @click="paveSimulate">开始模拟</el-button>
                        <el-button @click="toPreStep">返回</el-button>
                    </div>
                </div>
                
                <div class="line"></div>

                <div style="width: 58%; border: 1px solid #ebeef5; padding: 20px; height: 100%;">
                    <el-card class="box-card" shadow="hover" style="margin-top: 20px;">
                        <div slot="header" class="clearfix">
                            <span>房间配置详情</span>
                            <el-button style="float: right; padding: 3px 0" type="text" @click="toggleExpandAll">
                                {{ isAllExpanded ? '全部收起' : '全部展开' }}
                            </el-button>
                        </div>
                        <el-collapse v-model="activeRooms">
                            <el-collapse-item 
                                v-for="(room, index) in houseRooms" 
                                :key="room.id" 
                                :name="room.id"
                                :title="`${index + 1}. ${room.name}`"
                            >
                                <el-descriptions :column="1" border>
                                    <el-descriptions-item label="房间ID">{{ room.id }}</el-descriptions-item>
                                    <el-descriptions-item label="铺装起点">
                                        ({{ room.default_start_x }}, {{ room.default_start_y }})
                                    </el-descriptions-item>
                                    <el-descriptions-item label="铺装方向">
                                        {{ 
                                            {
                                                '1': '右上(↗)',
                                                '2': '左上(↖)',
                                                '3': '左下(↙)',
                                                '4': '右下(↘)'
                                            }[room.start_dir] || '未设置'
                                        }}
                                    </el-descriptions-item>
                                    <el-descriptions-item label="房间面积">
                                        {{ formatNumberWithCommas(room.room_area) }}m㎡
                                    </el-descriptions-item>
                                    <el-descriptions-item label="最大尺寸">
                                        {{ room.data_max_x }}mm × {{ room.data_max_y }}mm
                                    </el-descriptions-item>
                                    <!-- <el-descriptions-item label="是否标签区域">
                                        {{ room.is_label ? '是' : '否' }}
                                    </el-descriptions-item> -->
                                </el-descriptions>
                            </el-collapse-item>
                        </el-collapse>
                    </el-card>

                </div>
            </div>

            <!-- 步骤4：保存方案 -->
            <div v-if="active == 3" style="display: flex;">
                <div style="width: 40%;">
                    <el-card class="box-card" shadow="hover">
                        <div slot="header" class="clearfix">
                            <span>铺装模拟结果概览</span>
                        </div>
                        <el-descriptions :column="1" border>
                            <el-descriptions-item label="总房间面积">
                                {{ formatNumberWithCommas(total_room_area) }} m㎡
                            </el-descriptions-item>
                            
                            <el-descriptions-item label="踢脚线总长度">
                                {{ formatNumberWithCommas(total_room_length) }} mm
                            </el-descriptions-item>

                            <el-descriptions-item label="整铺地板数量">
                                {{ formatNumberWithCommas(fully_floor_num) }} 块
                            </el-descriptions-item>

                            <el-descriptions-item label="裁剪地板数量">
                                {{ formatNumberWithCommas(partly_floor_num) }} 块
                            </el-descriptions-item>

                            <el-descriptions-item label="地板总数量">
                                {{ formatNumberWithCommas(total_floor_num) }} 块
                            </el-descriptions-item>

                            <el-descriptions-item label="地板总面积">
                                {{ formatNumberWithCommas(total_floor_area) }} m㎡
                            </el-descriptions-item>
                            <el-descriptions-item label="平均损耗率">
                                {{ total_loss.toFixed(2) }} %
                            </el-descriptions-item>
                        </el-descriptions>
                    </el-card>

                    <div class="btn-group" style="margin-top: 20px;">
                        <el-button type="primary" @click="saveSimulateResult">保存铺装结果</el-button>
                        <el-button @click="toPreStep">返回（放弃当前方案）</el-button>
                    </div>

                    <el-card class="box-card" shadow="hover" style="margin-top: 20px;">
                        <div slot="header" class="clearfix">
                            <span>房间铺装详情</span>
                        </div>
                        <el-table :data="paveResultRooms" border style="width: 100%">
                            <el-table-column prop="room_name" label="房间名称" width="120"></el-table-column>
                            <el-table-column label="铺装起点">
                                <template slot-scope="scope">
                                    ({{ scope.row.start_x }}, {{ scope.row.start_y }})
                                </template>
                            </el-table-column>
                            <el-table-column label="铺装方向" width="150">
                                <template slot-scope="scope">
                                    {{ 
                                        {
                                            '1': '右上(↗)',
                                            '2': '左上(↖)',
                                            '3': '左下(↙)',
                                            '4': '右下(↘)'
                                        }[scope.row.start_dir] || '未设置'
                                    }}
                                </template>
                            </el-table-column>
                            <el-table-column label="操作" width="80">
                                <template slot-scope="scope">
                                    <el-button 
                                        type="text" 
                                        size="small"
                                        @click="currentResultRoomPage = scope.$index + 1"
                                    >查看</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>
                </div>
                
                <div class="line"></div>

                <div style="width: 58%; border: 1px solid #ebeef5; padding: 20px; height: 100%;">
                    <!-- 未选择户型时的提示 -->
                    <div v-if="paveResultRooms.length <= 0" class="empty-state">
                        <el-empty description="暂无铺装结果"></el-empty>
                    </div>

                    <!-- 铺装结果展示区 -->
                    <div v-else class="house-visualization">
                        <div v-loading="resultLoading">
                            <!-- 当前房间铺装结果 -->
                            <div v-if="currentResultRoom()" class="room-container">
                                <!-- 房间基本信息 -->
                                <div class="room-header">
                                    <h3>{{ currentResultRoom().room_name }} ({{ currentResultRoomPage }}/{{ paveResultRooms.length }})</h3>
                                </div>
                                
                                <!-- 铺装效果图展示 -->
                                <div class="room-image-container">
                                    <div class="room-image-wrapper">
                                        <el-image 
                                            :src="getImagePath(currentResultRoom().image_path)" 
                                            :preview-src-list="[getImagePath(currentResultRoom().image_path)]"
                                            fit="contain"
                                            style="width: 100%; display: block;"
                                        ></el-image>
                                    </div>
                                </div>
                                
                                <!-- 分页控制 -->
                                <div class="room-pagination">
                                    <el-button 
                                        :disabled="currentResultRoomPage <= 1" 
                                        @click="prevResultRoom"
                                        icon="el-icon-arrow-left"
                                    >上一间</el-button>
                                    
                                    <span class="page-info">{{ currentResultRoomPage }}/{{ paveResultRooms.length }}</span>
                                    
                                    <el-button 
                                        :disabled="currentResultRoomPage >= paveResultRooms.length" 
                                        @click="nextResultRoom"
                                    >下一间
                                    <i class="el-icon-arrow-right el-icon--right"></i>
                                    </el-button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getProjectByUserIdForList } from '@/api/ProjectManage.js';
import { getHousesByUserIdForList, getHousesByProjectIdForList } from '@/api/HouseManage.js'
import { getFuzzyRoomByHouse} from '@/api/RoomManage.js';
import { paveSimulate, saveSimulateResult } from '@/api/PaveManage.js'

import mSelect from '@components/common/mComponents/mSelect';
import mInput from '@components/common/mComponents/mInput';
import mInputGroup from '@components/common/mComponents/mInputGroup';
import { IncreasingFn, MaxNumber } from '@utils/common.js';
// import { optimize } from 'webpack';

export default {
    name: 'paveSimulate',
    components: { mSelect, mInput, mInputGroup },
    data() {
        return {
            user_id: localStorage.getItem('ms_user_id'),
            floorPaveForm: {
                user_id: localStorage.getItem('ms_user_id'),
                project_id: "",
                project_mission: '1',
                house_id: '',
                plan_name: '',
                floor_width: 400,
                floor_height: 120,
                pave_method: '369',
                pave_optimizer: '1',
                detail: '',

                room_id: '',
            },
            expand_size: 0,
            max_ignore_size: 0,
            current_start_x: 0,
            current_start_y: 0,
            current_start_dir: "1",
            active: 0, //当前步骤
            userProjects: [], //项目下拉框
            userHouses: [], //户型下拉框
            houseRooms: [], //当前户型下所有的房间信息
            selectProjectIndex: 0, //选中的项目Index

            // 户型已有数据展示
            currentRoomPage: 1, // 当前页码
            pageSize: 1, // 每页显示1个房间（可根据需求调整）
            roomLoading: false, // 加载状态,

            // 铺装模拟结果
            total_room_area: 0,
            total_floor_num: 0,
            total_floor_area: 0,
            fully_floor_num: 0,
            partly_floor_num: 0,

            room_pave_data: [],

            total_loss: 0,
            paveResultRooms:[],

            currentResultRoomPage: 1, // 当前结果房间页码
            resultLoading: false
        };
    },
    created() {
        this.getProjectData();
        this.getHouseData();
    },
    watch: {
        'floorPaveForm.project_id'(newVal) {
            if (newVal) {
                this.getHouseByProjectId(newVal)
            } else {
                this.userHouses = []
                this.floorPaveForm.house_id = ''
            }
        },
        'floorPaveForm.house_id'(newVal) {
            if (newVal) {
                this.getRoomByHouseId(newVal)
            }
            //  else {
            //     this.houseRooms = []
            // }
        },
        'floorPaveForm.room_id'(newVal) {
            if (newVal) {
                this.onRoomChange(newVal)
            }
        },
    },
    methods: {
        //获取项目信息
        async getProjectData() {
            let params = {
                user_id: this.user_id
            };
            await getProjectByUserIdForList(params)
                .then((res) => {
                    let { data, status } = res;
                    if (status == '200') {
                        this.userProjects = data;
                        if(this.userProjects.length > 0){
                            this.floorPaveForm.project_id = this.userProjects[0].id;
                        }
                    } else {
                        this.$message.error('获取项目数据失败!');
                    }
                })
                .catch((error) => {
                    this.$message.error('获取项目数据失败!');
                });
        },
        // 数字格式修改
        formatNumberWithCommas(cellValue) {
            // 处理可能的 null 或 undefined 值
            if (cellValue == null) return '';
            
            // 将数字转换为字符串并添加千位分隔符
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            
            // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
            // return Number(cellValue).toLocaleString('en-US');
        },
        //图片地址
        getImagePath(image_name) {
            return (this.$serverUrl + image_name);
        },
        toNextStep(){
            if(this.active == 0 && this.houseRooms.length <= 0){
                this.$message.warning("当前户型暂无铺装区域，无法进行铺装模拟");
                return ;
            }
            // 刚完成户型选择，填充对应的房间配置
            if(this.active == 0){
                this.floorPaveForm.room_id = this.houseRooms[0].id;
                this.currentRoomPage = 1;
            }


            this.active = this.active + 1;
            if (this.active > 3){
                this.active = 0;
            }
        },
        toPreStep(){
            if(this.active > 0){
                this.active = this.active - 1;
            }
        },
        //获取户型信息
        getHouseData() {
            let params = {
                user_id: this.user_id
            };
            getHousesByUserIdForList(params)
                .then((res) => {
                    let { data, status } = res;
                    if (status == '200') {
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
                        if (this.userHouses.length > 0) {
                            this.floorPaveForm.house_id = this.userHouses[0].id;
                        } else {
                            this.floorPaveForm.house_id = '';
                        }
                    } else {
                        this.$message.error('获取数据失败!');
                    }
                })
                .catch((error) => {
                    this.$message.error('获取数据失败!');
                });
        },
        // 通过户型ID查询房间信息
        getRoomByHouseId(houseId){

            // if (!houseId) {
            //     this.houseRooms = [];
            //     return;
            // }
            
            this.roomLoading = true;
            
            let params = {
                user_id: this.user_id,
                house_id: houseId,
                room_name: '',
                is_label: '',
                page_index: 1,
                page_size: 100000,
            };

            getFuzzyRoomByHouse(params)
                .then((res) => {
                    let { data, status } = res;
                    if (status == '200') {
                        this.houseRooms = data;
                        for(let i = 0; i < this.houseRooms.length; i++){
                            this.houseRooms[i].start_dir = "1";
                        }


                        this.currentRoomPage = 1; // 重置到第一页
                    } else {
                        this.$message.error('获取房间数据失败!');
                    }
                })
                .catch((error) => {
                    this.$message.error('获取房间数据失败!');
                })
                .finally(() => {
                    this.roomLoading = false;
                });
        },
        // 用户修改房间配置
        onRoomChange(roomId){
            // if (!this.currentRoomId) return -1;
            let index = this.houseRooms.findIndex(room => room.id === roomId);
            if(index >= 0){
                this.currentRoomPage = index + 1;

                this.current_start_x = this.houseRooms[index].default_start_x;
                this.current_start_y = this.houseRooms[index].default_start_y;
                this.current_start_dir = this.houseRooms[index].start_dir;

            }
        },
        saveCurrentRoomConfig(){
            this.houseRooms[this.currentRoomPage - 1].default_start_x = this.current_start_x
            this.houseRooms[this.currentRoomPage - 1].default_start_y = this.current_start_y
            this.houseRooms[this.currentRoomPage - 1].start_dir = this.current_start_dir

            this.$message.success('房间配置已保存');
        },
        // 上一页
        prevRoom() {
            if (this.currentRoomPage > 1) {
            this.currentRoomPage--;
            }
        },
        
        // 下一页
        nextRoom() {
            if (this.currentRoomPage < this.houseRooms.length) {
            this.currentRoomPage++;
            }
        },
        
        // 获取当前房间
        currentRoom() {
            if (this.houseRooms.length === 0) return null;
            return this.houseRooms[this.currentRoomPage - 1];
        },
        //重置表单
        resetForm() {
            for (let el in this.floorPaveForm) {
                if (el == 'user_id' || el == 'epochs') {

                } else if (el == 'project_mission') {
                    this.floorPaveForm[el] = '1';
                } else if(el == 'expand_size' || el == 'max_ignore_size'){
                    this.floorPaveForm[el] = 0;
                } else if(el == 'pave_method'){
                    this.floorPaveForm[el] = '369';
                } else if(el == 'pave_optimizer'){
                    this.floorPaveForm[el] = '1';
                }
                else                
                {
                    this.floorPaveForm[el] = '';
                }
            }
            this.$nextTick(() => {
                this.$refs['form'].clearValidate();
            });
            this.getProjectData();
        },
        // 封装铺装模拟请求数据
        preparePaveSimulateData() {
            // 获取当前选中的项目、户型和房间配置
            const currentProject = this.userProjects.find(p => p.id === this.floorPaveForm.project_id);
            const currentHouse = this.userHouses.find(h => h.id === this.floorPaveForm.house_id);
            
            return {
            // 基础信息
            user_id: this.user_id,
            project_id: this.floorPaveForm.project_id,
            house_id: this.floorPaveForm.house_id,
            
            // // 项目信息
            // project_info: {
            //     name: currentProject?.name || '',
            //     id: currentProject?.id || '',
            //     // 其他项目字段...
            // },
            
            // // 户型信息
            // house_info: {
            //     name: currentHouse?.name || '',
            //     id: currentHouse?.id || '',
            //     count: currentHouse?.count || 0,
            //     // 其他户型字段...
            // },
            
            // 铺装配置
            pave_config: {
                plan_name: this.floorPaveForm.plan_name,

                floor_width: this.floorPaveForm.floor_width,
                floor_height: this.floorPaveForm.floor_height,
                
                pave_method: this.floorPaveForm.pave_method,
                pave_optimizer: this.floorPaveForm.pave_optimizer,
                expand_size: this.floorPaveForm.expand_size,
                max_ignore_size: this.floorPaveForm.max_ignore_size,
                detail: this.floorPaveForm.detail
            },
            
            // 所有房间配置
            rooms_config: this.houseRooms.map(room => ({
                room_id: room.id,
                room_name: room.name,
                start_x: room.default_start_x,
                start_y: room.default_start_y,
                start_dir: room.start_dir,
                is_label: room.is_label,
                room_data: room.room_data,
                data_max_x: room.data_max_x,
                data_max_y: room.data_max_y,
                room_area: room.room_area
            }))
            };
        },
        // 铺装模拟
        paveSimulate() {
            const params = this.preparePaveSimulateData();

            const loading = this.$loading({
                            lock: true,
                            text: '铺装模拟中……',
                            spinner: 'el-icon-loading',
                            background: 'rgba(0, 0, 0, 0.7)'
                        });

            paveSimulate(params)
                .then((res) => {
                    let { data, status } = res;
                    if (status == '200') {

                        this.total_room_area = data.total_room_area,
                        this.total_room_length = data.total_room_length,

                        this.fully_floor_num = data.fully_floor_num,
                        this.partly_floor_num = data.partly_floor_num,                        
                        this.total_floor_num = data.total_floor_num,
                        this.total_floor_area = data.total_floor_area,

                        this.total_loss =  data.total_loss,
                        this.paveResultRooms = data.pave_room_list
                        this.room_pave_data = data.pave_room_list

                        this.active = 3;

                        this.$message.success("铺装模拟完成！");
                    } else {
                        this.$message.error('获取数据失败!');
                    }
                    loading.close()
                })
                .catch((error) => {
                    this.$message.error('获取数据失败!');
                    loading.close()
                })
                .finally(() => {
                    loading.close()
                });
        },
        // 封装铺装模拟请求数据
        prepareSimulateResultData() {
            // 获取当前选中的项目、户型和房间配置
            return {
                // 基础信息
                user_id: this.user_id,
                project_id: this.floorPaveForm.project_id,
                house_id: this.floorPaveForm.house_id,

                total_room_area: this.total_room_area,
                total_room_length: this.total_room_length,

                fully_floor_num: this.fully_floor_num,
                partly_floor_num: this.partly_floor_num,
                total_floor_num: this.total_floor_num,
                total_floor_area: this.total_floor_area,
                total_loss: this.total_loss,

                room_pave_data: this.room_pave_data,

                // 铺装配置
                pave_config: {
                    plan_name: this.floorPaveForm.plan_name,

                    floor_width: this.floorPaveForm.floor_width,
                    floor_height: this.floorPaveForm.floor_height,
                    
                    pave_method: this.floorPaveForm.pave_method,
                    pave_optimizer: this.floorPaveForm.pave_optimizer,
                    expand_size: this.floorPaveForm.expand_size,
                    max_ignore_size: this.floorPaveForm.max_ignore_size,
                    detail: this.floorPaveForm.detail
                },
                
                // 所有房间配置
                rooms_config: this.houseRooms.map(room => ({
                    room_id: room.id,
                    room_name: room.name,
                    start_x: room.default_start_x,
                    start_y: room.default_start_y,
                    start_dir: room.start_dir,
                    is_label: room.is_label,
                    room_data: room.room_data,
                    data_max_x: room.data_max_x,
                    data_max_y: room.data_max_y,
                    room_area: room.room_area,

                })),
            }
        },
        saveSimulateResult(){
            this.$confirm('确定要保存当前铺装方案吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = this.prepareSimulateResultData();

                const loading = this.$loading({
                                lock: true,
                                text: '铺装模拟结果保存中……',
                                spinner: 'el-icon-loading',
                                background: 'rgba(0, 0, 0, 0.7)'
                            });

                saveSimulateResult(params)
                    .then((res) => {
                        let { data, status } = res;
                        if (status == '200') {

                            this.active = 3;

                            this.$message.success("方案保存成功");
                        } else {
                            this.$message.error('获取数据失败!');
                        }
                        loading.close()
                    })
                    .catch((error) => {
                        this.$message.error('获取数据失败!');
                        loading.close()
                    })
                    .finally(() => {
                        loading.close()
                    });
            }).catch(() => {
                this.$message.info('已取消保存');         
            });
        },
        // 上一间结果房间
        prevResultRoom() {
            if (this.currentResultRoomPage > 1) {
                this.currentResultRoomPage--;
            }
        },
        
        // 下一间结果房间
        nextResultRoom() {
            if (this.currentResultRoomPage < this.paveResultRooms.length) {
                this.currentResultRoomPage++;
            }
        },
        
        // 获取当前结果房间
        currentResultRoom() {
            if (this.paveResultRooms.length === 0) return null;
            return this.paveResultRooms[this.currentResultRoomPage - 1];
        }
    }
};
</script>

<style scoped lang="less">
.error-text {
    color: #f56c6c;
}

.high-params {
    color: #409eff;
    margin-left: 50px;
    font-size: 16px;
    font-weight: bold;
}

.select-length {
    width: 100%;
}

.btn-group {
    margin: 10px 0 0 120px;
}

.params-title {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 24px 20px;
}


.line {
    border-right: 1px dashed #333;
    margin: 0 20px;
}
/// new add ==================


.steps-container {
  display: flex;
  background: #f5f5f5;
  margin-bottom: 20px;
}

.step {
  flex: 1;
  padding: 12px;
  text-align: center;
  color: #666;
  font-size: 14px;
}

.step.active {
  background: #2196f3;
  color: white;
}

.content-wrapper {
  padding: 0 20px 20px;
}

.user-input-container {
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-input {
  flex: 1;
  height: 24px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.user-input:focus {
  outline: none;
  border-color: #2196f3;
}

.legal-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.right-icon {
  color: #4caf50;
}

.error-icon {
  color: #f5222d;
}

.legal {
  color: #333;
}

.legal-label {
  color: #999;
}

.project-container {
  margin-bottom: 20px;
  text-align: center;
}

.project-select {
  font-size: 20px;
  color: #666;
  margin-bottom: 8px;
}

.project-dropdown {
  font-size: 18px;
  border: none;
  color: #2196f3;
  outline: none;
  background: transparent;
  cursor: pointer;
  margin-bottom: 10px;
}

.project-tag {
  display: inline-block;
  padding: 4px 8px;
  background: #fff1f0;
  color: #f5222d;
  font-size: 14px;
  border-radius: 2px;
}

.amount-container {
  margin-bottom: 20px;
}

.amount-grid {
	margin-left: 50px;
  display: flex;
  flex-wrap: wrap; /* 允许自动换行 */
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
}

.amount-btn {
	padding: 6px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  max-width: 120px;
}

.amount-btn:hover {
  border-color: #2196f3;
}

.amount-btn-active {
  border-color: #2196f3;
  background: #e6f7ff;
  color: #2196f3;
}

.custom-amount-wrapper {
  position: relative;
  display: inline-flex;
}

.custom-amount-wrapper input {
  /* width: 100%; */
  padding-right: 1.5em;
  white-space: nowrap;
  border-radius: 4px;
  text-align: center;
  max-width: 120px;
}

.custom-amount-wrapper input::placeholder {
  text-align: center;
}

.rmb-icon {
  display: flex;
  right: 0.5em;
  color: #999;
  font-size: 1em;
  pointer-events: none;
  align-items: center;
}

.payment-info {
  margin-bottom: 20px;
}

.payment-amount {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.payment-amount .amount {
  font-size: 20px;
  font-weight: bold;
  color: #f5222d;
}

.actual-amount {
  margin-top: 4px;
  font-size: 14px;
  color: #000;
}

.submit-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.submit-btn {
  width: 100%;
  height: 40px;
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background: #1976d2;
}

.warning-text {
  text-align: center;
  font-size: 12px;
  color: #f5222d;
}

/* 去除输入框数字箭头 */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}


.confirm-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.confirm-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.info-item {
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin-bottom: 10px;
}

.info-label {
  font-weight: bold;
}

.info-value {
  color: #333;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background-color: #f0f0f0;
  border: none;
}

.confirm-btn {
  background-color: #2196f3;
  color: white;
  border: none;
}

.complete-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
}

.complete-image {
  height: 300px;
  margin-bottom: 24px;
}

.complete-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.complete-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 24px;
}

.success-text {
  text-align: center;
  font-size: 12px;
  color: #4caf50;
}

.payment-options {
  width: 300px;
  margin: 0 auto;
  text-align: center;
}

.payment-option {
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
}

.payment-info {
  margin-left: 120px;
  display: flex;
  align-items: center;
}

.payment-icon {
  width: 24px;
  height: 24px;
  margin-right: 10px;
}

.check-mark {
  color: #00aaff;
  font-size: 16px;
  margin-left: auto;
  padding-right: 10px; /* Added padding to prevent overlap */
}


// NEW -- ADD -- ROOM -- SHOW
.house-visualization {
  height: 100%;
  overflow-y: auto;
}

.room-container {
  padding: 10px;
}

.room-header {
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.room-header h3 {
  margin: 0 0 5px 0;
  color: #303133;
}

.room-meta span {
  margin-right: 15px;
  color: #909399;
  font-size: 14px;
}

.room-data {
  margin-top: 20px;
}

.room-pagination {
  margin-top: 20px;
  text-align: center;
}

.page-info {
  display: inline-block;
  margin: 0 15px;
  line-height: 32px;
  color: #606266;
}

.room-image-container {
  max-height: 400px;
  overflow-y: auto; /* 垂直方向超出时显示滚动条 */
  border: 1px solid #ebeef5;
  border-radius: 4px;
  margin-bottom: 15px;
}

.room-image-wrapper {
  min-height: 400px; /* 确保容器有最小高度 */
  display: flex;
  align-items: center; /* 垂直居中 */
  justify-content: center; /* 水平居中 */
  padding: 10px;
  box-sizing: border-box;
}

/* 自定义滚动条样式（可选） */
.room-image-container::-webkit-scrollbar {
  width: 8px;
}

.room-image-container::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}

.room-image-container::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.room-image-container::-webkit-scrollbar-thumb:hover {
  background: #909399;
}
</style>
