<template>
    <div class="container">
        <el-row :gutter="3" type="flex">
            <el-col :span="1">
                <div class="toolFeatures">
                    <div class="assistFeatures">
                        <p class="saveJson" title="保存当前标注" @click="handleSave"></p>
                        <p class="toolName">保存</p>
                    </div>
                    <div class="separator"></div>
                    <div id="tools">

                        <div class="toolSet toolDrag" :class="{'focus':isFocus==='toolDrag'}" title="图片拖拽"
                             @click="handelToolDrag('toolDrag')"></div>
                        <p class="toolName">图片拖拽</p>


                        <div id="draw-ract">
                            <div class="toolSet toolRect" id="toolRect_id" :class="{'focus':isFocus==='toolRect'}"
                                 title="矩形工具"
                                 @click="handelToolRect('toolRect')"></div>
                            <p class="toolName">绘制矩形</p>
                        </div>

                        <div id="draw-polygon">
                            <div
                                class="toolSet toolPolygon"
                                id="toolPolyon_id"
                                :class="{ focus: isFocus === 'toolPolygon' }"
                                title="多边形工具"
                                @click="handelToolPolygon('toolPolygon')"
                            ></div>
                            <p class="toolName">多边形</p>
                        </div>

                    </div>
                </div>
            </el-col>
            <!-- 左侧 Canvas区域 -->
            <el-col :span="17" class="canvas-col">

                <AnnotationCanvas
                    ref="drawingCanvas"
                    :temp-point="tempPoint"
                    :last-point="lastPoint"
                    :first-point="firstPoint"
                    :images="images"
                    :selectedImageIndex="selectedImageIndex"
                    :points="selectedRoomData"
                    :rooms="rooms"
                    :drag-status="dragStatus"
                    :selectedRoom="selectedRoom"
                    @update:points="val => selectedRoomData = val"
                    @room-selected="handleRoomSelected"
                />
            </el-col>

            <el-col :span="6">
                <div class="commentResult">
                    <el-card class="room-selection">
                        <template #header>
                            <div class="card-header">
                                <span>选择房间</span>
                                <span>点集合总数 ({{ selectedRoomData.length }})</span>
                                <el-button
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                                    @click="resetRoomPoints"
                                    style="float: right; padding: 3px 0"
                                />
                            </div>
                        </template>
                        <el-select
                            v-model="selectedRoomId"
                            placeholder="请选择房间"
                            @change="selectRoom"
                            style="width: 100%"
                        >
                            <el-option
                                v-for="room in rooms"
                                :key="room.id"
                                :label="room.name"
                                :value="room.id"
                            />
                        </el-select>

                    </el-card>

                    <div class="commentResult">
                        <!-- 使用el-tabs来替代原来的切换按钮 -->
                        <el-tabs v-model="currentMode" type="border-card" @tab-change="handleTabChange"
                                 class="custom-tabs"  >
                            <!-- 插入点功能 -->
                            <el-tab-pane label="坐标模式" name="insert">
                                <el-form
                                    :model="insertData"
                                    label-width="90px"
                                class="form-align"
                                >
                                <!-- 前置索引输入 -->
                                <el-form-item label="前置索引">
                                    <el-input-number
                                        v-model.number="insertData.startIndex"
                                        :min="0"
                                        :max="selectedRoomData.length || 1"
                                        :disabled="selectedRoomData.length === 0"
                                        controls-position="right"
                                        class="form-input"
                                    />
                                </el-form-item>

                                <!-- 坐标输入组 -->
                                <div class="coordinate-group">
                                    <el-form-item label="X坐标">
                                        <el-input-number
                                            v-model.number="insertData.newPoint.x"
                                            :step="100"
                                            class="form-input"
                                        />
                                    </el-form-item>
                                </div>
                                    <div class="coordinate-group">
                                    <el-form-item label="Y坐标">
                                        <el-input-number
                                            v-model.number="insertData.newPoint.y"
                                            :step="100"
                                            class="form-input"
                                        />
                                    </el-form-item>
                                    </div>

                                <!-- 操作按钮 -->
                                <el-form-item class="form-action">
                                    <el-button
                                        type="success"
                                        @click="insertPointAfter"
                                        icon="el-icon-insert"
                                        size="medium"
                                    >插入点</el-button>
                                </el-form-item>
                                </el-form>
                            </el-tab-pane>

                            <!-- 移动控制功能 -->
                            <el-tab-pane label="绘制模式" name="move">
                                <el-form :model="moveDistance">
                                    <el-form-item label="自动保存" class="combined-control">
                                        <div class="control-wrapper">
                                            <el-switch
                                                v-model="autoAddMode"
                                                :active-value="true"
                                                :inactive-value="false"
                                                style="--el-switch-on-color: #67C23A; --el-switch-off-color: #909399"
                                                @change="handleModeChange"
                                                :before-change="validateModeChange"
                                            >
                                                <template #active>
                                                    <span class="inner-label">自动</span>
                                                </template>
                                                <template #inactive>
                                                    <span class="inner-label">手动</span>
                                                </template>
                                            </el-switch>

                                            <!-- 坐标显示区域 -->
                                            <div v-if="tempPoint || show_lastPoint" class="coordinate-display1">
                                                <el-tag  class="coordinate-item">
                                                    X: {{ autoAddMode ? show_lastPoint.x : tempPoint.x }}
                                                </el-tag>
                                                <el-tag class="coordinate-item">
                                                    Y: {{ autoAddMode ? show_lastPoint.y : tempPoint.y }}
                                                </el-tag>
                                            </div>
                                        </div>
                                    </el-form-item>


                                    <el-form-item label="平移距离">
                                        <el-input-number
                                            v-model.number="moveDistance.value"
                                            :step="100"
                                            controls-position="right"
                                            style="width: 50%"
                                        />
                                    </el-form-item>

                                    <el-form-item class="direction-buttons">
                                        <div class="direction" >
                                        <div class="direction-container">
                                            <!-- 上下左右方向键 -->
                                            <div class="direction-keyboard">
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-top"
                                                        @click="movePoint('up')"
                                                    >上
                                                    </el-button>
                                                </div>
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-back"
                                                        @click="movePoint('left')"
                                                    >左
                                                    </el-button>
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-right"
                                                        @click="movePoint('right')"
                                                    >右
                                                    </el-button>
                                                </div>
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-bottom"
                                                        @click="movePoint('down')"
                                                    >下
                                                    </el-button>
                                                </div>
                                            </div>
                                        </div>
                                            <!-- 确认和取消按钮 -->


                                                <el-button
                                                    v-if="!autoAddMode"
                                                    type="success"
                                                    :icon="isOverlapping ? 'el-icon-warning' : 'el-icon-check'"
                                                    :disabled="isOverlapping || !tempPoint"
                                                    @click="handleConfirmAction"
                                                    class="add-btn"
                                                >
                                                    {{ getConfirmButtonText }}
                                                </el-button>

                                                <el-button
                                                    v-if="!autoAddMode"
                                                    type="danger"
                                                    icon="el-icon-close"
                                                    :disabled="!tempPoint"
                                                    @click="quitTempPoint"
                                                    class="cancel-btn"
                                                >
                                                    取消添加
                                                </el-button>
                                            </div>

                                    </el-form-item>

                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>
                    <el-card class="resultArea">
                        <el-table
                            :data="selectedRoomData"
                            border
                            height="400px"
                            style="width: 100%"
                        >
                            <el-table-column label="序号" align="center">
                                <template #default="{ $index }">
                                    {{ $index + 1 }}
                                </template>
                            </el-table-column>

                            <el-table-column prop="x" label="X坐标" align="center" />
                            <el-table-column prop="y" label="Y坐标" align="center" />

                            <el-table-column label="显隐" align="center">
                                <template #default="{ row, $index }">
                                    <el-switch
                                        v-model="row.visible"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="() => handleVisibilityChange($index)"
                                    />
                                </template>
                            </el-table-column>

                            <el-table-column label="编辑" width="60" align="center">
                                <template #default="{ $index }">
                                    <el-button
                                        type="primary"
                                        icon="el-icon-edit"
                                        size="mini"
                                        circle
                                        @click="editPoint($index)"
                                    />
                                </template>
                            </el-table-column>

                            <el-table-column label="删除" width="65" align="center">
                                <template #default="{ $index }">
                                    <el-button
                                        type="danger"
                                        icon="el-icon-delete"
                                        size="mini"
                                        circle
                                        @click="removePoint($index)"
                                    />
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-card>





                </div>
            </el-col>
            <!-- 右侧 标注结果集 -->

        </el-row>
    </div>
</template>

<script>
import Point from '@/components/page/UserHouseManage/js/Point.js';
import axios from 'axios';
import AnnotationCanvas from '@components/page/UserHouseManage/AnnotationCanvas.vue';
import { updateRoomLabelById } from '@/api/AnnotationManage';

import { getAnnotationHouseById } from '@/api/HouseManage';


// 修改后的保存方法

export default {
    name: 'datasetAnnotation',
    components: {
        AnnotationCanvas
    },
    data() {
        return {
            user_id:localStorage.getItem('ms_user_id'),//用户ID
            house_id:localStorage.getItem('annotation_house_id'),//房间ID
            // annotation_index:
            insertData: {
                startIndex: 0,
                newPoint: { x: null, y: null }
            },
            currentMode: 'insert', // 默认显示插入点功能
            images: [
                {
                    name: '默认图片',
                    base64: require('@/assets/img/img.jpg')
                }
            ],
            isFocus: 'toolDrag',//工具栏
            selectedImageIndex: 0,
            rooms: [],
            selectedRoom: null,
            selectedRoomId: -1,
            selectedRoomData: [],
            currentPoint: { x: '', y: '' },
            moveDistance: { value: 100 },  // 默认平移距离
            autoAddMode: false,
            tempPoint: null,               // 临时点
            lastPoint: null,               // 最后有效点
            firstPoint: null,
            show_lastPoint: null,
            dragStatus: true,

        };
    },
    watch: {
        selectedRoomData(newData) {
            if (newData.length > 0) {
                this.insertData.startIndex = newData.length; // 设置为当前长度
            } else {
                this.insertData.startIndex = 0; // 至少是1
            }
        }
    },
    mounted() {
        this.fetchRoomData();

        window.addEventListener('keydown', this.handleKeyPress);
    },

    beforeUnmount() {
        window.removeEventListener('keydown', this.handleKeyPress);
    },
    computed: {
        getConfirmButtonText() {
            if (this.tempPoint) {
                return this.isOverlapping ? '非法位置' : '确认添加';
            }
            return '无临时点';
        },

        isOverlapping() {
            if (!this.tempPoint) return false;

            // 点重叠检测（5像素容差）
            const pointConflict = this.selectedRoomData.some(point =>
                this.calculateDistance(point, this.tempPoint) < 5
            );

            // 线重叠检测（3像素容差）
            const lineConflict = this.selectedRoomData.some((point, index) => {
                const nextPoint = this.selectedRoomData[(index + 1) % this.selectedRoomData.length];
                return this.pointToLineDistance(this.tempPoint, point, nextPoint) < 3;
            });

            return pointConflict || lineConflict;
        }
    },
    methods: {
        insertPointAfter() {
            // 验证索引有效性（转换为0-based索引）
            const index = this.insertData.startIndex - 1;
            console.log(index)
            if (index < -1 || index >= this.selectedRoomData.length) {
                this.$message.error('无效的索引范围');
                return;
            }

            // 验证坐标输入
            if (this.insertData.newPoint.x === null || this.insertData.newPoint.y === null) {
                this.$message.warning('请填写完整坐标');
                return;
            }

            // 创建新点实例
            const newPoint = new Point(
                this.insertData.newPoint.x,
                this.insertData.newPoint.y
            );

            // 冲突检测
            if (this.checkAutoOverlap(newPoint)) {
                this.$message.warning('新点位置与现有图形冲突');
                return;
            }

            // 执行插入操作
            this.selectedRoomData.splice(index + 1, 0, newPoint);
            this.insertData.startIndex = this.selectedRoomData.length
            // 重置表单
            this.insertData.newPoint = { x: null, y: null };
            this.$refs.drawingCanvas.redraw();

            this.$message.success(`成功在${index + 1}号点后插入新点`);
        },
        calculateDistance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy).toFixed(2);
        },
        pointToLineDistance(p, a, b) {
            const A = p.x - a.x;
            const B = p.y - a.y;
            const C = b.x - a.x;
            const D = b.y - a.y;

            const dot = A * C + B * D;
            const lenSq = C * C + D * D;
            let param = -1;

            if (lenSq !== 0) {
                param = dot / lenSq;
            }

            let xx, yy;
            if (param < 0) {
                xx = a.x;
                yy = a.y;
            } else if (param > 1) {
                xx = b.x;
                yy = b.y;
            } else {
                xx = a.x + param * C;
                yy = a.y + param * D;
            }

            const dx = p.x - xx;
            const dy = p.y - yy;
            return Math.sqrt(dx * dx + dy * dy);
        },
        handleConfirmAction() {
            if (this.isOverlapping) {
                this.$message.warning('添加位置与已有图形重叠');
                return;
            }

            if (this.tempPoint) {
                this.confirmTempPoint();
            } else {
                if (this.selectedRoomData.length === 0) {
                    this.$message.warning('请先添加起始点');
                    return;
                }
                this.tempPoint = this.selectedRoomData[this.selectedRoomData.length - 1].clone();
            }
        },

        selectRoom() {
            const room = this.rooms.find(r => r.id === this.selectedRoomId);
            if (room) {
                this.selectedRoom = room;
                this.selectedRoomData = room.room_data.map(p => new Point(p[0], p[1]));
                this.$refs.drawingCanvas.redraw();
            } else {
                this.selectedRoomData = [];
            }
        },
        handleRoomSelected(roomId) {
            this.selectedRoomId = roomId;
            this.selectRoom();
        },
        resetRoomPoints() {
            this.selectedRoomData = this.selectedRoom.room_data.map(p => new Point(p[0], p[1]));
            this.insertData.startIndex = this.selectedRoomData.length
            this.$refs.drawingCanvas.redraw();
        },
        removePoint(index) {
            this.selectedRoomData.splice(index, 1);
            this.insertData.startIndex = this.selectedRoomData.length
            this.$refs.drawingCanvas.redraw();
        },
        editPoint(index) {
            const newX = prompt('请输入新的X坐标：', this.selectedRoomData[index].x);
            const newY = prompt('请输入新的Y坐标：', this.selectedRoomData[index].y);
            if (newX !== null && newY !== null) {
                this.selectedRoomData[index].x = Number(newX);
                this.selectedRoomData[index].y = Number(newY);
                this.$refs.drawingCanvas.redraw();
            }
        },
        toggleVisibility(index) {
            this.selectedRoomData[index].visible = !this.selectedRoomData[index].visible;
            this.$refs.drawingCanvas.redraw();
        },

        checkAutoOverlap(tempPoint) {
            if (!tempPoint) return false;

            // 点重叠检测（5像素容差）
            const pointConflict = this.selectedRoomData.some(point =>
                this.calculateDistance(point, tempPoint) < 5
            );

            // 线重叠检测（3像素容差）
            const lineConflict = this.selectedRoomData.some((point, index) => {
                const nextPoint = this.selectedRoomData[(index + 1) % this.selectedRoomData.length];
                return this.pointToLineDistance(tempPoint, point, nextPoint) < 3;
            });

            return pointConflict || lineConflict;
        },
        movePoint(direction) {
            if (!this.selectedRoomData.length && !this.tempPoint) {
                this.$message.warning('请先添加起始点');
                return;
            }

            // 获取基准点（自动模式下始终使用最后一个正式点）
            const basePoint = this.autoAddMode ?
                this.selectedRoomData[this.selectedRoomData.length - 1] :
                (this.tempPoint || this.selectedRoomData[this.selectedRoomData.length - 1]);
            // 确保basePoint已定义
            if (!basePoint) {
                this.$message.warning('无法获取基准点');
                return;
            }
            // 计算新坐标
            const newPoint = new Point(basePoint.x, basePoint.y);

            const distance = this.moveDistance.value || 0;

            switch (direction) {
                case 'up':
                    newPoint.y += distance;
                    break;
                case 'down':
                    newPoint.y -= distance;
                    break;
                case 'left':
                    newPoint.x -= distance;
                    break;
                case 'right':
                    newPoint.x += distance;
                    break;
            }

            // 自动模式处理逻辑
            if (this.autoAddMode) {
                if (this.checkAutoOverlap(newPoint)) {
                    this.$message.warning('添加位置与已有图形重叠');
                    return;
                }

                this.selectedRoomData.push(newPoint.clone());
                this.lastPoint = newPoint.clone();
                this.show_lastPoint = newPoint.clone();
                this.$refs.drawingCanvas.redraw();
            } else {
                // 手动模式保持原有逻辑
                this.tempPoint = newPoint.clone();
                this.lastPoint = this.selectedRoomData[this.selectedRoomData.length - 1];
                this.firstPoint = this.selectedRoomData[0];

                this.$refs.drawingCanvas.redraw();
            }
        },
        quitTempPoint() {
            if (!this.tempPoint) return;
            this.tempPoint = null;
            this.$refs.drawingCanvas.redraw();
        },
        confirmTempPoint() {
            if (!this.tempPoint) return;

            this.selectedRoomData.push(this.tempPoint);
            this.lastPoint = this.tempPoint;
            this.tempPoint = null;
            this.$refs.drawingCanvas.redraw();

        },
        handleKeyPress(e) {
            const directions = {
                ArrowUp: 'up',
                ArrowDown: 'down',
                ArrowLeft: 'left',
                ArrowRight: 'right'
            };

            if (directions[e.key]) {
                e.preventDefault();
                this.movePoint(directions[e.key]);
            }
        },
        handleModeChange(newVal) {
            if (newVal) {
                this.$message.success('已启用自动添加模式');
                this.tempPoint = null;
                this.$refs.drawingCanvas.redraw();
            } else {
                this.show_lastPoint = null
                this.$message.info('已切换为手动模式');
            }
        },
        validateModeChange() {
            return this.selectedRoomData.length > 0 ||
                confirm('当前无起始点，确定要启用自动模式吗？');
        },
        handleTabChange(activeName) {
            console.log('当前激活的tab:', activeName);
            // 这里可以添加切换tab时需要执行的逻辑
            // 比如重置某些表单数据、切换模式等
            this.currentMode = activeName; // 这个赋值其实已经通过v-model自动完成

            // 示例：当切换到insert标签时清空插入表单
            if (activeName === 'insert') {
                this.show_lastPoint = null
                this.insertData.newPoint = { x: null, y: null };
            }

            // 示例：当切换到move标签时重置临时点
            if (activeName === 'move') {
                this.tempPoint = null;
            }
        },

        handleVisibilityChange(index) {
            this.$refs.drawingCanvas.redraw(); // 触发重绘
            this.$message.info(
                `点 ${index + 1} 已${this.selectedRoomData[index].visible ? '显示' : '隐藏'}`
            );
        },// 在methods中添加handleSave方法
          // 计算多边形面积（使用Shoelace公式）
        calculatePolygonArea(points) {
            if (points.length < 3) return 0;

            let area = 0;
            for (let i = 0; i < points.length; i++) {
                const j = (i + 1) % points.length;
                area += points[i].x * points[j].y;
                area -= points[j].x * points[i].y;
            }

            return Math.abs(area / 2);
        },
        // 数字格式修改
        formatNumberWithCommas( cellValue) {
            // 处理可能的 null 或 undefined 值
            if (cellValue == null) return '';

            // 将数字转换为字符串并添加千位分隔符
            return cellValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

            // 如果你需要更精确的数字处理，也可以使用 toLocaleString 方法
            // return Number(cellValue).toLocaleString('en-US');
        },
        // 计算多边形周长
        calculatePolygonLength(points) {
            if (points.length < 2) return 0;

            let length = 0;
            for (let i = 0; i < points.length; i++) {
                const j = (i + 1) % points.length;
                const dx = points[j].x - points[i].x;
                const dy = points[j].y - points[i].y;
                length += Math.sqrt(dx * dx + dy * dy);
            }
            return length;
        },
        fetchRoomData() {
            if(this.annotation_room_id===-1){

            }
            const requestBody = {
                user_id:this.user_id,
                house_id: this.house_id
            };

            axios.post('http://192.168.51.67:8888/getAnnotationHouseById', requestBody)
                .then(response => {
                    const {status, msg, data} = response.data;
                    if (status === 200) {
                        this.rooms = data.room_list;
                        if (this.rooms.length > 0) {
                            this.selectedRoom = this.rooms[0];
                            this.selectedRoomId = this.selectedRoom.id;
                            this.selectedRoomData = this.selectedRoom.room_data.map(p => new Point(p[0], p[1]));
                            // 设置默认的 startIndex
                            this.insertData.startIndex = this.selectedRoomData.length || 1;
                            this.$refs.drawingCanvas.redraw();
                        }
                    } else {
                        console.error(msg);
                    }
                })
                .catch(error => {
                    console.error('获取房间数据失败:', error);
                });
        },

// 修改后的保存方法
        handleSave() {


            if (!this.selectedRoom) {
                this.$message.error('请先选择房间');
                return;
            }
            if (this.selectedRoomData.length < 3) {
                this.$message.error('至少需要三个点才能构成房间');
                return;
            }
            const loading = this.$loading({
                lock: true,
                text: '数据存储中...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });
            // 整合数据
            let sendPoints = []
            for(let i = 0; i < this.selectedRoomData.length; i++){
                let tempPoint = []
                tempPoint.push(this.selectedRoomData[i].x)
                tempPoint.push(this.selectedRoomData[i].y)
                sendPoints.push(tempPoint)
            }

            const requestData = {
                user_id: 1,
                room_id: this.selectedRoom.id,
                // room_data: this.selectedRoomData.map(p => [p.x, p.y]),
                room_data: sendPoints,
                data_max_x: Math.max(...this.selectedRoomData.map(p => p.x)),
                data_max_y: Math.max(...this.selectedRoomData.map(p => p.y)),
                default_start_x: this.selectedRoomData[0].x,
                default_start_y: this.selectedRoomData[0].y,
                room_area: this.calculatePolygonArea(this.selectedRoomData),
                room_length: this.calculatePolygonLength(this.selectedRoomData),
            };
            console.log("发送的数据：", JSON.stringify(requestData, null, 2));
            updateRoomLabelById(requestData)
                .then(response => {
                    // 注意这里响应结构可能需要调整
                    if (response.status === 200) { // 根据实际响应结构调整
                        this.$message.success('保存成功');
                        this.selectedRoom.islabel = 1;
                        this.fetchRoomData();
                    } else {
                        this.$message.error(response.msg || '保存失败');
                    }
                })
                .catch(error => {
                    console.error('保存失败:', error);
                    this.$message.error(error.message || '保存失败，请检查网络连接');
                })
                .finally(() => {
                    loading.close();
                });
        },
        handelToolDrag(opt) {
            //切换时隐藏标签管理的弹框
            this.isFocus = opt;
            this.isFocus = '';
            this.dragStatus = !this.dragStatus;
            if (!this.dragStatus) {
                this.isFocus = '';
            } else {
                this.isFocus = opt;
            }

        },
        handelToolRect(opt) {
            this.isFocus = opt;

        },
        handelToolPolygon(opt) {
            this.isFocus = opt;

        },


    }
};
</script>

<style scoped>
/* 整体布局 */

/* 输入框统一宽度 */
.form-input {
    width: 220px !important;  /* 固定宽度 */
}

/* 操作按钮容器 */
.form-action {
    position: relative;
    height: 48px;  /* 设定明确高度 */
}

.form-action ::v-deep(.el-form-item__content) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    white-space: nowrap;
}
.control-wrapper {
    display: flex;
}
.coordinate-item
{
    padding: 2px 6px;
    border-radius: 4px;

}
.custom-tabs {
    height: 300px;  /* 整体高度 */
}

/* 坐标显示样式 */
.coordinate-display1 {

    display: flex;
    gap: 12px;
    margin-left: auto; /* 右侧对齐 */

}
.inner-label {
     font-size: 12px;
     padding: 0 4px;
     position: relative;
     top: -1px;
 }


/* 在style部分添加 */
.temp-coordinate {
    display: flex;
    gap: 15px;
    margin-right: 20px;
    align-items: center;
}

.coord-item {
    background: #f5f7fa;
    padding: 5px 10px;
    border-radius: 4px;
    font-family: monospace;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 调整按钮样式 */
.el-button.is-circle {
    padding: 5px;
    margin: 2px;
}

el-card {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.resultArea {
    max-height: 500px;

}
/* 表头居中 */
.el-table th > .cell {
    display: flex;
    justify-content: center;
}

/* 表格行内容垂直居中 */
.el-table td {
    vertical-align: middle;
}

/* 显隐开关居中 */
.el-table .el-switch {
    display: flex;
    justify-content: center;
}

/* 表格行内容垂直居中 */
.el-table td {
    vertical-align: middle;
}

.container {
    padding: 20px;
    background-color: #f5f7fa;
}


.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.direction-buttons {
    text-align: center;
}

.el-table {
    margin-top: 15px;
}

.el-form-item {
    margin-bottom: 18px;
}

.el-input-number {
    width: 50%;
}

.el-button--mini {
    padding: 5px 10px;
}

.direction-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 10px 0;
}
.button-container .el-button {
    width: 100%;
}
.direction{
    display: flex;
    flex-direction: row;
}
.direction-keyboard {
    flex: 0.5;
    margin-left:20px;
    margin-right: 25px;
}

.direction-row {
    display: flex;
    justify-content: center;
    margin: 8px 0;

    .el-button {
        margin: 0 5px;
        width: 80px;
    }
}

.add-btn {
    margin-top: 50px;
    width: 100px;
    height:40px ;
}

.cancel-btn {
    margin-top: 50px;
    width: 100px;
    height:40px ;
}


.insert-point .el-form-item {
    margin-bottom: 18px;
}

.insert-point .el-input-number {
    width: 200px;
}

.el-row {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.toolFeatures {
    padding-left: 0;
    margin-left: 0;
}

.el-card {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
}

.container {
    padding-left: 0;
    margin-left: 0;
}

/* 添加过渡动画 */
.el-switch {
    transition: all 0.3s ease;
}

/* 隐藏点的半透明效果 */
.hidden-point {
    opacity: 0.3;
    filter: grayscale(80%);
}

@import "../../../assets/css/DatasetManage/font-awesome.min.css";
@import "../../../assets/css/DatasetManage/style.css";
@import "../../../assets/css/DatasetManage/switch.css";
</style>
