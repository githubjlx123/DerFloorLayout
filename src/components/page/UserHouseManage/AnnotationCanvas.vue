<template>

    <div class="canvas-container">

        <canvas
            ref="canvas"
            :width="canvasWidth"
            :height="canvasHeight"
            :style="{ width: canvasWidth + 'px', height: canvasHeight + 'px' }"
            @mousemove="handleMouseMove"
            @mousedown="handleMouseDown"
            @mouseup="handleMouseUp"
            @mouseleave="handleMouseUp"
            @contextmenu="handleCanvasRightClick"
        />
        <div class="coordinate-display">
            坐标：({{ coordinate.x }}, {{ coordinate.y }})
        </div>
        <div class="zoom-info">缩放: {{ (scale * 100).toFixed(0) }}%</div>
        <div v-if="rooms && selectedRoom" class="room-info-overlay">
            <h4>{{ selectedRoom.name }}</h4>
            <p>面积: {{ selectedRoom.room_area }}</p>
            <p>周长: {{ selectedRoom.room_length }}</p>
        </div>
    </div>
</template>

<script>
import Point from '@/components/page/UserHouseManage/js/Point.js';
export default {
    name:'AnnotationCanvas',
    props: {
        points: {
            type: Array,
            default: () => []
        },
        rooms: {
            type: Array,
            default: () => []
        },
        selectedRoom: {
            type: Object,
            default: null
        },
        canvasWidth: {
            type: Number,
            default: 1100
        },
        canvasHeight: {
            type: Number,
            default: 900
        },
        images: {
            type: Array,
            default: () => []
        },
        selectedImageIndex: {
            type: Number,
            default: 0
        },
        firstPoint: {
            type: Point,
            default: null
        },
        lastPoint: {
            type: Point,
            default: null
        },
        // 修正 prop 命名规范（可选）
        tempPoint: {
            type: Point,
            default: null
        },
        dragStatus: {
            type: Boolean,
            default: true
        },

    },
    watch: {
        tempPoint: {
            validator(value) {
                return value === null || value instanceof Point;
            },
            default: null
        },
        lastPoint: {
            validator(value) {
                return value === null || value instanceof Point;
            },
            default: null
        },
        firstPoint: {
            validator(value) {
                return value === null || value instanceof Point;
            },
            default: null
        },
        images: {
            handler(newImages) {
                this.loadedImages = [];
                newImages.forEach((imgObj, idx) => {
                    const img = new Image();
                    img.src = imgObj.base64;
                    img.onload = () => {
                        this.loadedImages[idx] = img;
                        this.redraw();
                    };
                });
            },
            deep: true,
            immediate: true
        },
        points: {
            handler(newVal) {
                this.localPoints = newVal.map(point => {
                    if (point instanceof Point) {
                        return point;
                    } else {
                        return new Point(point.x, point.y, point.visible);
                    }
                });
                this.autoFit();
            },
            immediate: true,
            deep: true
        },
        selectedRoom: {
            handler(newVal) {
                if (newVal) {
                    this.localPoints = newVal.room_data.map(p => new Point(p[0], p[1]));
                    this.autoFit();
                    this.redraw();
                }
            },
            deep: true
        },
        dragStatus(newVal) {
            if (!newVal) {
                this.isDragging = false; // 外部关闭时立即停止拖拽
                this.$refs.canvas.style.cursor = 'default';
            }
        }

    },

    data() {
        return {
            isDragging: false,
            lastDragPos: { x: 0, y: 0 },
            ctx: null,
            localPoints: [],
            coordinate: {x: 0, y: 0},
            currentPoint: {x: '', y: ''},
            scale: 1,
            offset: {x: 0, y: 0},
            minScale: 0.01,
            maxScale: 5,
            loadedImages: [],
            selectedRoomId: -1,
            autoFitApplied: false
        };
    },
    mounted() {
        const canvas = this.$refs.canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
        this.offset = {x: 0, y: 0};
        canvas.addEventListener('wheel', this.handleWheel, {passive: false});
        this.redraw();
    },
    methods: {
// 修改 autoFit 方法中的偏移计算
        autoFit() {
            if (this.localPoints.length === 0) return;

            // 坐标范围计算保持不变
            const minX = Math.min(...this.localPoints.map(p => p.x));
            const minY = Math.min(...this.localPoints.map(p => p.y));
            const maxX = Math.max(...this.localPoints.map(p => p.x));
            const maxY = Math.max(...this.localPoints.map(p => p.y));

            const width = maxX - minX;
            const height = maxY - minY;

            const scaleX = (this.canvasWidth * 0.9) / width;
            const scaleY = (this.canvasHeight * 0.9) / height;
            this.scale = Math.min(scaleX, scaleY, this.maxScale);

            // 计算逻辑中心点（注意坐标系方向）
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;

            // 关键修复：恢复正确的偏移计算
            this.offset = {
                x: this.canvasWidth / 2 - centerX * this.scale,
                y: this.canvasHeight / 2 - centerY * this.scale // 恢复减法运算
            };

            this.autoFitApplied = true;
        },
        // 修改后的坐标处理方法
        handleMouseMove(e) {
            const rect = this.$refs.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offset.x) / this.scale;
            const y = (this.canvasHeight - (e.clientY - rect.top) - this.offset.y) / this.scale; // 翻转Y坐标

            this.coordinate.x = x.toFixed(1);
            this.coordinate.y = y.toFixed(1);

            if (this.isDragging) {
                const currentX = e.clientX - rect.left;
                const currentY = e.clientY - rect.top;

                this.offset.x += currentX - this.lastDragPos.x;
                this.offset.y -= currentY - this.lastDragPos.y; // 修改拖动方向

                this.lastDragPos = { x: currentX, y: currentY };
                this.redraw();
            }
        },

        // 新增拖动相关方法
        handleMouseDown(e) {
            if (this.dragStatus && e.button === 0) {
                this.isDragging = true;
                const rect = this.$refs.canvas.getBoundingClientRect();
                this.lastDragPos = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                this.$refs.canvas.style.cursor = 'grabbing';
            }
        },


        handleMouseUp() {
            this.isDragging = false;
            this.$refs.canvas.style.cursor = 'crosshair';
        },



        handleCanvasRightClick(e) {
            e.preventDefault();
            const rect = this.$refs.canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left - this.offset.x) / this.scale;
            const y = (e.clientY - rect.top - this.offset.y) / this.scale;
            this.removePointAt(x, y);
        },


        // 修改后的滚轮缩放处理
        handleWheel(e) {
            e.preventDefault();

            const oldScale = this.scale;
            const scaleFactor = 1.1;
            this.scale = e.deltaY < 0
                ? Math.min(this.maxScale, this.scale * scaleFactor)
                : Math.max(this.minScale, this.scale / scaleFactor);

            const rect = this.$refs.canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;

            this.offset.x = mx - (this.scale / oldScale) * (mx - this.offset.x);
            this.offset.y = this.canvasHeight - my - (this.scale / oldScale) *
                ((this.canvasHeight - my) - this.offset.y); // 调整锚点计算

            this.redraw();
        },

        // 修改后的重绘方法
        redraw() {
            requestAnimationFrame(() => {
                this.ctx.save();
                this.ctx.setTransform(1, 0, 0, 1, 0, 0);
                this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
                this.ctx.restore();

                this.ctx.save();
                // 应用坐标变换（关键修改）
                this.ctx.setTransform(
                    this.scale,
                    0,
                    0,
                    -this.scale, // Y轴翻转
                    this.offset.x,
                    this.canvasHeight - this.offset.y // 调整原点位置
                );
                // this.drawImage();
                this.drawPoints();
                this.ctx.restore();
            });
        },

        // 修改后的图片绘制方法
        drawImage() {
            const selectedIndex = this.selectedImageIndex;
            const img = this.loadedImages[selectedIndex];
            if (img) {
                // 调整图片绘制位置
                this.ctx.drawImage(img, 0, -img.height); // 保持图片正常方向
            }
        },

        drawPoints() {
            if (this.localPoints.length === 0) return;

            // 1. 过滤出可见点
            const visiblePoints = this.localPoints.filter(p => p.visible !== false);

            // 2. 绘制多边形路径（仅可见点）
            this.ctx.beginPath();
            visiblePoints.forEach((point, index) => {
                index === 0 ?
                    this.ctx.moveTo(point.x, point.y) :
                    this.ctx.lineTo(point.x, point.y);
            });

            // 3. 闭合路径条件修正
            if (visiblePoints.length > 1) {
                // 始终连接首尾可见点（而不是原始数组的首尾）
                this.ctx.lineTo(visiblePoints[0].x, visiblePoints[0].y);
            }

            // 4. 填充和描边
            this.ctx.fillStyle = 'rgba(255, 209, 127, 0.5)';
            this.ctx.fill();
            this.ctx.strokeStyle = 'blue';
            this.ctx.lineWidth = 1 / this.scale;
            this.ctx.stroke();

                // 绘制点间距离
                this.ctx.fillStyle = '#333';
                this.ctx.font = `${60 * this.scale}px Arial`; // 根据缩放调整字体大小
                this.ctx.textAlign = 'center';

            visiblePoints.forEach((point, index) => {
                const nextPoint = visiblePoints[(index + 1) % visiblePoints.length];
                    if (nextPoint.visible !== false) {
                        // 计算中点位置
                        const midX = (point.x + nextPoint.x) / 2;
                        const midY = (point.y + nextPoint.y) / 2;

                        // 绘制距离
                        this.ctx.save();
                        this.ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置矩阵获取物理坐标
                        const physicalMid = this.logicalToPhysical(midX, midY);
                        this.ctx.fillText(
                            this.calculateDistance(point, nextPoint) ,
                            physicalMid.x,
                            physicalMid.y
                        );
                        this.ctx.restore();
                    }
                });


            // 绘制点和序号
            this.localPoints.forEach((point, index) => {
                if (point.visible !== false) {
                    // 绘制点
                    this.ctx.beginPath();
                    point.draw1(this.ctx);

                    // 绘制序号
                    this.ctx.fillStyle ='rgba(30,144,255)';
                    this.ctx.font = `${80 * this.scale}px Arial`;
                    this.ctx.textAlign = 'left';

                    this.ctx.save();
                    this.ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置矩阵获取物理坐标
                    const physicalPos = this.logicalToPhysical(point.x, point.y);
                    this.ctx.fillText(
                        `${index + 1}`,
                        physicalPos.x ,  // 向右偏移8像素
                        physicalPos.y-5,    // 向上偏移8像素
                    );
                    this.ctx.restore();
                }
            });
            // 绘制临时点
            if (!this.$parent.autoAddMode && this.tempPoint) {
                this.drawTempPoint();
            }
        },
        drawTempPoint() {
            if (!this.tempPoint) return;

            // 绘制临时点
            this.ctx.beginPath();
            this.tempPoint.draw1(this.ctx);
            this.ctx.fillStyle = 'rgba(255,0,0,0.5)';
            this.ctx.fill();
            if (this.firstPoint) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.firstPoint.x, this.firstPoint.y);
                this.ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.lineWidth = 1 / Math.abs(this.ctx.getTransform().a); // 动态计算线宽
                this.ctx.stroke();
            }
            // 绘制临时连线（使用物理坐标计算线宽）
            if (this.lastPoint) {
                this.ctx.beginPath();
                this.ctx.moveTo(this.lastPoint.x, this.lastPoint.y);
                this.ctx.lineTo(this.tempPoint.x, this.tempPoint.y);
                this.ctx.strokeStyle = '#ff0000';
                this.ctx.lineWidth = 1 / Math.abs(this.ctx.getTransform().a); // 动态计算线宽
                this.ctx.stroke();
            }

        },
// 添加距离计算方法
        calculateDistance(p1, p2) {
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            return Math.sqrt(dx * dx + dy * dy).toFixed(2);
        },
// 新增坐标转换方法
        logicalToPhysical(logicalX, logicalY) {
            return {
                x: logicalX * this.scale + this.offset.x,
                y: this.canvasHeight - (logicalY * this.scale + this.offset.y)
            };
        },
        removePointAt(x, y) {
            const pointToRemove = this.localPoints.find(point => {
                const dx = x - point.x;
                const dy = y - point.y;
                return Math.sqrt(dx * dx + dy * dy) <= 5 / this.scale; // 考虑缩放后的点击区域
            });
            if (pointToRemove) {
                const index = this.localPoints.indexOf(pointToRemove);
                this.localPoints.splice(index, 1);
                this.$emit('update:points', this.localPoints);
                this.redraw();
            }
        },
    }
};
</script>

<style scoped>
.canvas-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

canvas {
    border: 2px solid #ccc;
    border-radius: 8px;
    background-color: #f5f5f5;
    cursor: crosshair;
}

.coordinate-display {
    position: absolute;
    bottom: 10px;
    right: 10px;
    background-color: white;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.zoom-info {
    position: absolute;
    bottom: 40px;
    right: 10px;
    background-color: white;
    padding: 5px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reset-btn,
.save-btn {
    padding: 8px 16px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;
    margin: 10px 0;
}

.reset-btn:hover,
.save-btn:hover {
    background-color: #3265b1;
}

.room-info-overlay {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.8);
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
canvas {
    cursor: crosshair;
}

</style>
