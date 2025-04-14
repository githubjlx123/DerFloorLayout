export default class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.visible = true;
        this.radius = 20;
        this.color = 'red';
    }

    draw1(ctx) {
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fillStyle = this.color;
        ctx.fillStyle = this.visible ? '#ff0000' : 'transparent';
        ctx.fill();
    }
    clone() {
        return new Point(this.x, this.y, this.visible);
    }
}
