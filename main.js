
// Canvas config
const framerate = 120;
const canvas_width = 800;
const canvas_height = 600;

// Physics config
const gravity = 250;
const floorpos = (canvas_height * 0.8)

// Entities
let points = [];
let lines = [];

const myGameArea = {
	canvas: document.createElement("canvas"),

	start: function () {
		this.canvas.width = canvas_width;
		this.canvas.height = canvas_height;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.frameNo = 0;
		this.interval = setInterval(updateGameArea, 1000 / framerate);
	},

	clear: function () {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}

class line {
	constructor(a, b) {

		this.a = a;
		this.b = b;

		this.curLength = function () {
			let dx = this.a.x - this.b.x;
			let dy = this.a.y - this.b.y;
			return Math.sqrt(dx * dx + dy * dy);
		};

		this.distance = this.curLength();

		this.update = function () {
			const delta = this.distance - this.curLength();
			const nx = (this.a.x - this.b.x) / this.curLength();
			const ny = (this.a.y - this.b.y) / this.curLength();

			this.a.x += nx * delta / 2;
			this.a.y += ny * delta / 2;
			this.b.x -= nx * delta / 2;
			this.b.y -= ny * delta / 2;
		};

		this.draw = function () {
			const ctx = myGameArea.context
			ctx.beginPath();
			ctx.moveTo(this.a.x, this.a.y);
			ctx.lineTo(this.b.x, this.b.y);
			ctx.stroke();
		};
	}
}

function startGame() {
	const a = new point(-50 + canvas_width / 2, 50 + canvas_height / 3, (Math.random() - 0.5) * 10, -2, 0, gravity);
	const b = new point(50 + canvas_width / 2, 50 + canvas_height / 3, (Math.random() - 0.5) * 10, -2, 0, gravity);
	const c = new point(-50 + canvas_width / 2, -50 + canvas_height / 3, (Math.random() - 0.5) * 10, -2, 0, gravity);
	const d = new point(50 + canvas_width / 2, -50 + canvas_height / 3, (Math.random() - 0.5) * 10, -2, 0, gravity);

	points.push(a);
	points.push(b);
	points.push(c);
	points.push(d);

	lines.push(new line(a, b));
	lines.push(new line(a, c));
	lines.push(new line(a, d));
	lines.push(new line(b, c));
	lines.push(new line(b, d));
	lines.push(new line(c, d));

	myGameArea.start();
}

class point {
	constructor(x, y, xvel, yvel, xacc, yacc) {
		this.x = x;
		this.oldx = x - xvel;
		this.xacc = xacc;

		this.y = y;
		this.oldy = y - yvel;
		this.yacc = yacc;

		this.tempx;
		this.tempy;

		this.update = function () {

			if (this.y > floorpos) {
				this.oldy = this.y;
				this.y = canvas_height * 0.8 - 0.01;
				this.oldx = (this.x + this.oldx) / 2;
			}

			if (this.x < 0) {
				this.oldx = this.x;
				this.x = 0;
			}

			if (this.x > canvas_width) {
				this.oldx = this.x;
				this.x = canvas_width;
			}

			this.tempx = this.x;
			this.tempy = this.y;
			this.x += (this.x - this.oldx) + this.xacc / (framerate * framerate);
			this.y += (this.y - this.oldy) + this.yacc / (framerate * framerate);
			this.oldx = this.tempx;
			this.oldy = this.tempy;


			/* // uncomment to draw dots on points
			ctx.beginPath();
			ctx.arc(this.x, this.y, 5, 0, 2*Math.PI);
			ctx.fillStyle = "red"
			ctx.fill();
			/* */
		};
	}
}

function updateGameArea() {

	myGameArea.clear();
	myGameArea.frameNo += 1;

	const ctx = myGameArea.context
	ctx.beginPath();
	ctx.moveTo(0, floorpos);
	ctx.lineTo(canvas_width, floorpos);
	ctx.stroke();

	for (let n = 0; n < 2; n++) {
		for (let i = 0; i < points.length; i++) {
			points[i].update();
		}

		for (let j = 0; j < 1; j++) {
			for (let i = 0; i < lines.length; i++) {
				lines[i].update();
			}
		}
	}
	for (let i = 0; i < lines.length; i++) {
		lines[i].draw();
	}
}
