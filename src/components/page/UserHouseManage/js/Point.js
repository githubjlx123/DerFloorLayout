export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visible = true;
        this.radius = 20;
        this.color = 'red';
        this.type='line';  //circle
        this.category='wall';

    }

    draw(ctx, scale = 1) {
        const baseRadius = 5; // 基础半径
        const dynamicRadius = baseRadius / Math.sqrt(scale); // 根据缩放动态调整

        ctx.beginPath();
        ctx.arc(this.x, this.y, dynamicRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }
    clone() {
        return new Point(this.x, this.y, this.visible);
    }
}
