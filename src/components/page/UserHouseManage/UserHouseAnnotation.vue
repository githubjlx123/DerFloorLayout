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
            <el-col :span="17">
                <AnnotationCanvas
                    ref="drawingCanvas"
                    :temp-point="tempPoint"
                    :last-point="lastPoint"
                    :first-point="firstPoint"
                    :images="images"
                    :selectedImageIndex="selectedImageIndex"
                    :points="selectedRoomData"
                    :rooms="rooms"
                    :selectedRoom="selectedRoom"
                    @update:points="val => selectedRoomData = val"
                    @room-selected="handleRoomSelected"
                />
            </el-col>

            <el-col :span="8">
                <div class="commentResult">
                    <el-card class="room-selection">
                        <template #header>
                            <div class="card-header">
                                <span>选择房间</span>
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



                    <el-card class="resultArea">
                        <template #header>
                            <div class="card-header">
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

                        <el-table
                            :data="selectedRoomData"
                            border
                            style="width: 100%"
                            height="400px"
                        >
                            <!-- 序号列 -->
                            <el-table-column
                                label="序号"
                                width="40"
                                align="center"
                            >
                                <template #default="{ $index }">
                                    {{ $index + 1 }}
                                </template>
                            </el-table-column>

                            <!-- X坐标列 -->
                            <el-table-column
                                prop="x"
                                label="X坐标"
                                width="80"
                                align="center"
                            >
                                <template #default="{ row }">
                                    {{ row.x.toFixed(2) }}
                                </template>
                            </el-table-column>

                            <!-- Y坐标列 -->
                            <el-table-column
                                prop="y"
                                label="Y坐标"
                                width="80"
                                align="center"
                            >
                                <template #default="{ row }">
                                    {{ row.y.toFixed(2) }}
                                </template>
                            </el-table-column>

                            <!-- 修改后的显隐列 -->
                            <el-table-column label="显隐" width="80" align="center">
                                <template #default="{ row, $index }">
                                    <el-switch
                                        v-model="row.visible"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        @change="() => handleVisibilityChange($index)"
                                    />
                                </template>
                            </el-table-column>

                            <!-- 编辑列 -->
                            <el-table-column
                                label="编辑"
                                width="60"
                                align="center"
                            >
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

                            <!-- 删除列 -->
                            <el-table-column
                                label="删除"
                                width="65"
                                align="center"
                            >
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


                    <div class="commentResult">
                        <!-- 使用el-tabs来替代原来的切换按钮 -->
                        <el-tabs v-model="currentMode"   type="border-card" @tab-change="handleTabChange">
                            <!-- 插入点功能 -->
                            <el-tab-pane label="插入点" name="insert">
                                <el-form :model="insertData" >
                                    <!-- 前置索引输入 -->
                                    <el-form-item label="前置索引">
                                        <el-input-number
                                            v-model.number="insertData.startIndex"
                                            :min="1"
                                            :max="selectedRoomData.length || 1"
                                            :disabled="selectedRoomData.length === 0"
                                            controls-position="right"
                                        />
                                    </el-form-item>

                                    <!-- 新点坐标输入 -->
                                    <el-form-item label="X坐标">
                                        <el-input-number
                                            v-model.number="insertData.newPoint.x"
                                            :step="100"
                                        />
                                    </el-form-item>

                                    <el-form-item label="Y坐标">
                                        <el-input-number
                                            v-model.number="insertData.newPoint.y"
                                            :step="100"
                                        />
                                    </el-form-item>

                                    <el-form-item>
                                        <el-button
                                            type="success"
                                            @click="insertPointAfter"
                                            icon="el-icon-insert"
                                        >插入点</el-button>
                                    </el-form-item>
                                </el-form>

                            </el-tab-pane>

                            <!-- 移动控制功能 -->
                            <el-tab-pane label="自动/手动" name="move">
                                <el-form :model="moveDistance">
                                    <el-form-item label="自动/手动">
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
                                        <div v-if="tempPoint||show_lastPoint" class="temp-coordinate">
                                            <span class="coord-item">X: {{ autoAddMode ? show_lastPoint.x : tempPoint.x }}</span>
                                            <span class="coord-item">Y: {{ autoAddMode ? show_lastPoint.y : tempPoint.y }}</span>
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
                                        <div class="direction-container">
                                            <!-- 上下左右方向键 -->
                                            <div class="direction-keyboard">
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-top"
                                                        @click="movePoint('up')"
                                                    >上</el-button>
                                                </div>
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-back"
                                                        @click="movePoint('left')"
                                                    >左</el-button>
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-right"
                                                        @click="movePoint('right')"
                                                    >右</el-button>
                                                </div>
                                                <div class="direction-row">
                                                    <el-button
                                                        type="primary"
                                                        icon="el-icon-bottom"
                                                        @click="movePoint('down')"
                                                    >下</el-button>
                                                </div>
                                            </div>

                                            <!-- 确认和取消按钮 -->
                                            <div class="button-container">

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
                                        </div>
                                    </el-form-item>

                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </div>

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

export default {
    name: 'datasetAnnotation',
    components: {
        AnnotationCanvas
    },
    data() {
        return {
            insertData: {
                startIndex: 0,
                newPoint: { x: null, y: null }
            },
            canvasWidth: 1500,
            canvasHeight: 900,
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
            lastPoint: null ,               // 最后有效点
            firstPoint: null,
            show_lastPoint: null,
        };
    },
    watch: {
        selectedRoomData(newData) {
            if (newData.length > 0) {
                this.insertData.startIndex = newData.length; // 设置为当前长度
            } else {
                this.insertData.startIndex = 1; // 至少是1
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
            if (index < 0 || index >= this.selectedRoomData.length) {
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
            this.insertData.startIndex=this.selectedRoomData.length
            // 重置表单
            this.insertData.newPoint = {x: null, y: null};
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
        fetchRoomData() {
            const requestBody = {
                user_id: 1,
                house_id: 1
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
            this.insertData.startIndex=this.selectedRoomData.length
            this.$refs.drawingCanvas.redraw();
        },
        removePoint(index) {
            this.selectedRoomData.splice(index, 1);
            this.insertData.startIndex=this.selectedRoomData.length
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
                this.show_lastPoint= newPoint.clone();
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
            this.tempPoint = this.lastPoint;
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
                this.show_lastPoint= null
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
                this.show_lastPoint= null
                this.insertData.newPoint = { x: null, y: null };
            }

            // 示例：当切换到move标签时重置临时点
            if (activeName === 'move') {
                this.tempPoint = null;
            }
        },
        async handleSave() {
            let arr = [];
            let saveRes = false;

            return saveRes;
        },
        handelToolDrag(opt) {
            //切换时隐藏标签管理的弹框
            [...this.$refs.labelManageRef.classList].indexOf('focus') && this.$refs.labelManageRef.classList.remove('focus');
            this.isFocus = opt;
            this.annotate.SetFeatures('dragOn', true);
        },
        handelToolRect(opt) {
            EventBus.$on('isValidRect', () => {
                this.isFocus = '';
            });
            [...this.$refs.labelManageRef.classList].indexOf('focus') && this.$refs.labelManageRef.classList.remove('focus');
            this.isFocus = opt;
            this.canvas.style.cursor = 'crosshair';
            this.annotate.SetFeatures('rectOn', true);
        },
        handleVisibilityChange(index) {
            this.$refs.drawingCanvas.redraw(); // 触发重绘
            this.$message.info(
                `点 ${index + 1} 已${this.selectedRoomData[index].visible ? '显示' : '隐藏'}`
            );
        }
    }
};
</script>

<style scoped>

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

.direction-keyboard {
    flex: 0.5;
    margin-left: 60px;
    margin-right: 20px;
}

.button-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    width: 160px;
    margin-left: -20px;
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
    width:100px;
}
.cancel-btn {
    width:100px;
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

.el-card {
    margin-bottom: 20px;

    &:last-child {
        margin-bottom: 0;
    }
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
