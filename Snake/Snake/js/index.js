// 先定义画布的大小，单位为px
var mapWidth = 800;
var mapHeight = 400;
// 假设每一节蛇用正方形表示，此处定义这个小正方形的大小，这个正方形的大小就是贪吃蛇的移动步长
var gridSize = 20;

var mainCanvas = document.getElementById('mainCanvas');
// 根据上面定义的行列数和格子大小修改画布的大小
mainCanvas.width = mapWidth;
mainCanvas.height = mapHeight;
// 获取画布的绘制句柄
var mainCtx = mainCanvas.getContext('2d');
// 蛇，一节一节按从前到后的顺序摆放，第0个是蛇头
// 一开始先随机生成蛇头的位置
var snake = [{
	x: 20 * Math.floor( Math.random() * 30 + 5),   //Math.random()生成0-1之间随机数
	y: 20 * Math.floor(Math.random() * 11 + 5)  //y: Math.floor(mapHeight * 0.25 + 0.5 * Math.random() * mapHeight)

}];
console.log("对象的值为：",snake[0]);
// 星星，蛇吃到星星之后可以长长
// 一开始先随机生成星星的位置
// 这里有个Bug，这个随机的坐标应该保证整个星星都在画布内！！
var star = {
	x: 20 * Math.floor( Math.random() * 38),
	y: 20 * Math.floor(Math.random() * 18)
};
console.log("对象的值为：",star);

var upDirection = 0;
var downDirection = 1;
var leftDirection = 2;
var rightDirection = 3;
// 定义4个移动方向，即上下左右
var directionArray = [upDirection, downDirection, leftDirection, rightDirection];
// 随机决定一个初始移动方向
var direction = directionArray[Math.floor(Math.random() * directionArray.length)];

// 根据左上角坐标绘制正方形，color代表颜色
function drawRect(pos, color) {
	mainCtx.fillStyle = color;
	mainCtx.fillRect(pos.x, pos.y, gridSize, gridSize);
}

function drawMap() {
	// 移动蛇的位置
	snakeMove();
	// 清空当前画布，相当于檫黑板
	mainCtx.clearRect(0, 0, mapWidth, mapHeight);
	var snakeHead = snake[0];
	// 绘制蛇头，使用红色#ff0000
	drawRect(snakeHead, '#ff0000');
	for (var i = 1; i < snake.length; i++) {
		// 绘制蛇身，使用黑色#000000
		drawRect(snake[i], '#000000');
	}
	// 绘制星星，使用绿色#00ff00
	drawRect(star, '#00ff00');

	//创建迷雾	
	makeFog();

	// 判断蛇头的位置是否撞墙了，如果是则游戏结束。判断边界条件不能等于，只能大于或小于，有等于就是到达边界值的时候就不能操作了
	// if (snakeHead.x < 0 || snakeHead.x > mapWidth - gridSize
		// || snakeHead.y < 0 || snakeHead.y > mapHeight - gridSize) {   
		// setTimeout(function(){
			// alert('你输了！');
			// pageReload();
		// },0);
	// }
	if (snakeHead.x < 0) {
		snakeHead.x = mapWidth;
	} else if (snakeHead.x > mapWidth) {
		snakeHead.x = 0;		
	} else if (snakeHead.y < 0) {
		snakeHead.y = mapHeight;
	} else if (snakeHead.y > mapHeight) {
		snakeHead.y = 0;
	} else {}
	// 判断蛇头的位置是否撞自己了，如果是则游戏结束
	for (var i = 3; i < snake.length; i++) {
		if (snake[i].x == snakeHead.x && snake[i].y == snakeHead.y) {
			setTimeout(function(){
				alert('你输了！');
				pageReload();
			},0);
		}
	}
	
}
//制造迷雾

function makeFog() {
	var snakeHead = snake[0];
	for(var i = 0; i < 40; i++) {
		var x = i * 20;
		for(var j = 0; j < 20; j++) {
			var y = j * 20;
			var fog = {
				x: x,
				y: y
			};
			// fogSize表示视野的大小，也就是迷雾离蛇身子的距离
			var fogSize = 40;
            // 判断在当前位置是否应该绘制迷雾，判断标准是当前位置离蛇的每一节身子的距离是否都大于fogSize
            var drawFog = true;
			for(var q = 0; q < snake.length; q++){
				if(fog.x >= snake[q].x - fogSize && fog.x <= snake[q].x + fogSize
					&& fog.y >= snake[q].y -fogSize && fog.y <= snake[q].y + fogSize) {
					drawFog = false;
					break;
				}
			}
			if (drawFog) {
                drawRect(fog, '#47719C');
			}
		}		
	} 	
} 
// 判断两个正方形是否重合
// pos1表示第一个正方形的左上角坐标，如{x:10,y:20}
// pos2表示第二个正方形的左上角坐标
// 两个正方形的边长都等于gridSize
function rectOverlap(pos1, pos2) {
	// 判断两个左上角顶点的横纵坐标的距离是否都小于边长即可
	return Math.abs(pos1.x-pos2.x) < gridSize && Math.abs(pos1.y-pos2.y) < gridSize;
}

// 刷新页面
function pageReload() {
	location.reload();
}

// 移动蛇的身子，贪吃蛇是一节一节连接的，总是后面的节点跟着前面的节点走
function snakeMove() {
	var snakeHead = snake[0];
	// 判断蛇有没有吃到星星，即判断蛇头所在的正方形跟星星所在的正方形有没有重叠
	if (rectOverlap(snakeHead, star)) {
		// 吃到星星之后再随机生成一个位置产生星星
		// 这里有个Bug，生成新的星星时应该判断新的位置是否跟蛇重叠！！
		var isOnSnake = true;
		while(isOnSnake) {
			isOnSnake = false;
			star = { x: 20 * Math.floor(Math.random() * 38),
				     y: 20 * Math.floor(Math.random() * 18)
					};
			for (var i = 0; i < snake.length; i++) {
				if (star.x == snake[i].x && star.y == snake[i].y) {
					isOnSnake = true;
					break;
				}
			}
		}
		
		// 长出来的蛇尾的位置在这里不重要，因为在下面的移动中会自动更新为之前的蛇尾的位置
		snake.push({
			x: 0,
			y: 0
		});
	}
	for (var i = snake.length-1; i > 0; i--) {
		// 后一个节点移动到前一个节点的位置
		snake[i].x = snake[i-1].x;
		snake[i].y = snake[i-1].y;
	}
	// 最后移动蛇头的位置
	// 这里还有一个Bug，贪吃蛇应该是不能直接180度调头的！！
	switch (direction) {
		case upDirection:
		snakeHead.y -= gridSize;
		break;
		case downDirection:
		snakeHead.y += gridSize;
		break;
		case leftDirection:
		snakeHead.x -= gridSize;
		break;
		case rightDirection:
		snakeHead.x += gridSize;
		break;
		default:
		alert('方向异常！');
		pageReload();
		break;
	}
}

// 监听键盘按键事件，方向键控制蛇的移动方向
window.onkeydown = function(e){
	switch (e.key) {
		case 'ArrowUp':
		if(direction !== 1) {
			direction = upDirection;
		}
		break;
		case 'ArrowDown':
		if(direction !== 0) {
			direction = downDirection;
		}
		break;
		case 'ArrowRight':
		if(direction !== 2) {
			direction = rightDirection;
		}
		break;
		case 'ArrowLeft':
		if(direction !== 3) {
			direction = leftDirection;
		}
		break;
		default:
		break;
	}
}

// 绘制初始地图
drawMap();
// 游戏循环
var gameLoop;
document.getElementById('startGame').onclick = function(){
	clearInterval(gameLoop);
	// 每100ms重新绘制地图
	gameLoop = setInterval(drawMap, 100);
}
document.getElementById('pauseGame').onclick = function(){
	clearInterval(gameLoop);
}


function cnvs_getCoordinates(e) {   //当鼠标放入canvas内时显示坐标
			x=e.clientX - 283;
			y=e.clientY  - 80;
			document.getElementById("xycoordinates").innerHTML="(" + x + "," + y + ")";
		}
		 
function cnvs_clearCoordinates() {   //当鼠标移出canvas时清除坐标
	document.getElementById("xycoordinates").innerHTML="Coordinates";
}

