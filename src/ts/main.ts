let buttons: HTMLElement[][] = null;
let table: number[][] = null;
let map: number[][] = null;
let timer: number = null, tick = 0;

const width = 10, height = 10, wh = width * height, bombs = 15;
let openCount = 0, finished = 0;

function initTable(width: number, height: number, value: number): number[][] {
	let x, y, table = [];
	for (y = 0; y < height; y++) {
		let row = [];
		for (x = 0; x < width; x++) {
			row.push(0);
		}
		table.push(row);
	}
	return table;
}

window.addEventListener('load', () => {
	buttons = initScreen(width, height);
	let x, y, i, j, vec = [], tmp;
	table = initTable(width, height, 0);
	map = initTable(width, height, 0);
	for (x = 0; x < width; x++)
		for (y = 0; y < height; y++)
			vec.push([x, y]);
	for (i = 0; i < vec.length && i < bombs; i++) {
		j = i + Math.floor(Math.random() * (vec.length - i));
		tmp = vec[j];
		vec[j] = vec[i];
		vec[i] = tmp;
		x = vec[i][0], y = vec[i][1];
		if (x > 0) {
			if (y > 0) table[y - 1][x - 1]++;
			table[y][x - 1]++;
			if (y < height - 1) table[y + 1][x - 1]++;
		}
		if (y > 0) table[y - 1][x]++;
		table[y][x] = Infinity;
		if (y < height - 1) table[y + 1][x]++;
		if (x < width - 1) {
			if (y > 0) table[y - 1][x + 1]++;
			table[y][x + 1]++;
			if (y < height - 1) table[y + 1][x + 1]++;
		}
	}
});

function contextMenuEvent(e: MouseEvent) {
	e.preventDefault();
}

function tryOpen(x: number, y: number) {
	if (x < 0 || y < 0 || x >= width || y >= height) return;
	if (table[y][x] < Infinity) {
		openRecursive(x, y);
		if (openCount + bombs >= width * height) {
			let i, j;
			for (j = 0; j < height; j++) {
				for (i = 0; i < width; i++) {
					if (map[j][i] == 0) {
						map[j][i] = -1;
						buttons[j][i].classList.add('flag');
					}
				}
			}
			finished = 1;
			if (timer) clearTimeout(timer);
		}
	}
}

function updateTime() {
	document.getElementById("timer").innerText = ("00" + (0 | (tick / 60))).slice(-2) + ":" + ("00" + (0 | (tick % 60))).slice(-2);
	tick++;
	timer = setTimeout(updateTime, 1000);
}

function openRecursive(x: number, y: number) {
	if (x < 0 || y < 0 || x >= width || y >= height) return;
	let val = table[y][x];
	let obj = buttons[y][x];
	if (map[y][x] > 0) return;
	map[y][x] = 1;
	obj.classList.add('open');
	obj.classList.add('num' + val);
	openCount++;
	if (val != 0) obj.innerText = "" + val;
	if (val == 0) {
		let i, j;
		for (j = x - 1; j <= x + 1; j++) {
			for (i = y - 1; i <= y + 1; i++) {
				if (table[i] && table[i][j] == Infinity) stop;
				if (j != x || i != y) openRecursive(j, i);
			}
		}
	}


}

function mouseUpEvent(e: MouseEvent) {
	let x: number = +this.getAttribute('x');
	let y: number = +this.getAttribute('y');
	if (finished) return;
	if (!timer) updateTime();
	if (e.button == 2) {	// Right btn
		if (map[y][x] <= 0) {
			if (map[y][x] == -1) {
				this.classList.remove('flag');
				map[y][x] = 0;
			} else {
				this.classList.add('flag');
				map[y][x] = -1;
			}
		}

	} else {
		if (map[y][x] == 0) {
			tryOpen(x, y);

		} else if (map[y][x] == 1) {
			let val = table[y][x];
			let i, j;
			for (j = y - 1; j <= y + 1; j++) {
				for (i = x - 1; i <= x + 1; i++) {
					if (map[j][i] == -1) val--;
				}
			}
			if (val == 0) {
				for (j = y - 1; j <= y + 1; j++) {
					for (i = x - 1; i <= x + 1; i++) {
						if (map[j][i] == 0) tryOpen(i, j);
					}
				}
			}
		}
	}
	e.preventDefault();
}

function initScreen(width: number, height: number): HTMLElement[][] {
	let ret = [];
	let base = document.getElementById("base");
	for (let y = 0; y < height; y++) {
		let line = [];
		let lineDom = document.createElement('ul');
		for (let x = 0; x < width; x++) {
			let cell = document.createElement('li');
			cell.setAttribute('x', '' + x);
			cell.setAttribute('y', '' + y);
			cell.addEventListener('mouseup', mouseUpEvent);
			cell.addEventListener('contextmenu', contextMenuEvent);
			line.push(cell);
			lineDom.appendChild(cell);
		}
		ret.push(line);
		base.appendChild(lineDom);
	}
	return ret;
}
