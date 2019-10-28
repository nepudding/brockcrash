var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ballnum = 10;
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;
var rightPressed = false;
var leftPressed = false;
var brickRowCount = 4;
var brickColumnCount = 6;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var bricks = [];
for (var c=0;c<brickColumnCount;c++){
    bricks[c] = [];
    for (var r=0;r<brickRowCount;r++){
        bricks[c][r] = {x: c*(brickWidth+brickPadding) + brickOffsetLeft,
                        y: r*(brickHeight+brickPadding) + brickOffsetTop,
                        status: 1};
    }
}
function drawBricks(){
    for (var c=0;c<brickColumnCount;c++){
        for (var r=0;r<brickRowCount;r++){
            var b = bricks[c][r];
            if (b.status == 1){
                ctx.beginPath();
                ctx.rect(b.x,b.y,brickWidth,brickHeight);
                ctx.fillStyle = "#00CC88";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawPaddle(){
    ctx.beginPath();
    ctx.rect(paddleX,canvas.height-paddleHeight,paddleWidth,paddleHeight);
    ctx.fillStyle = "#00aeef";
    ctx.fill();
    ctx.closePath();
}

function randomColor(){
    return "#"+ Math.floor((16**6) * Math.random()).toString(16);
}

function collisionDetectioin() {
    for(var c=0; c<brickColumnCount; c++) {
        for(var r=0; r<brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1){
                if(ball.x-ball.size < b.x+brickWidth && ball.x+ball.size > b.x &&
                    ball.y-ball.size < b.y+brickHeight && ball.y+ball.size > b.y){
                    var flagx = 1;
                    var flagy = 1;
                    if (ball.x-ball.size-ball.dx< b.x+brickWidth && ball.x+ball.size -ball.dx > b.x){
                        flagy *= -1;
                    }
                    if(ball.y-ball.size-ball.dy < b.y+brickHeight && ball.y+ball.size-ball.dy > b.y){
                        flagx *= -1;
                    }
                    ball.dx *= flagx;
                    ball.dy *= flagy;
                    b.status = 0;
                    ball.color = randomColor();
                }
            }
        }
    }
}

class Ball{
    constructor(){
        this.size = 10;
        this.x = canvas.width / 2 ;
        this.y = canvas.height / 2 + 10;
        this.radian = Math.PI * (Math.random()-0.5)*0.5;
        this.dx = Math.sin(this.radian)*2
        this.dy = Math.cos(this.radian)*2
        this.color = randomColor();
        this.visible = true;
    }
    draw(){
        if (this.visible == false)return;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
    action(){
        if (this.visible == false)return;
        if (this.x < 0 || this.x > canvas.width){
            this.dx *= -1;
            this.color = randomColor();
        }
        if (this.y < 0){ // 下辺
            this.dy *= -1;
            this.color = randomColor();
        }
        if (this.y > canvas.height -paddleHeight && this.x > paddleX && this.x < paddleX + paddleWidth ){
            if(this.dy > 0){
                this.y -= this.dy;
                var d = (this.dx**2 + this.dy**2)**0.5 *1.1;
                this.radian =(((this.x - paddleX + paddleWidth/2)/paddleWidth - 1)*-0.8 +1)* Math.PI;
                this.dx = Math.sin(this.radian)*2
                this.dy = Math.cos(this.radian)*2
                this.color = randomColor();
            }
        }
        else if (this.y + this.dy > canvas.height + this.size){
            this.visible = false;
            alert("GAMEOVER");
            document.location.reload();
            clearInterval(interval);
        }
        this.x += this.dx;
        this.y += this.dy;
    }

}
var ball = new Ball();
var flag = 0;
var life;
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ball.draw();
    ball.action();
    if (rightPressed && paddleX + paddleWidth < canvas.width){
        paddleX += 7;
    }
    if (leftPressed && paddleX > 0){
        paddleX -= 7;
    }
    drawPaddle();
    drawBricks();
    collisionDetectioin();
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e){
    if (e.key == "Right" || e.key == "ArrowRight" ){
        rightPressed = true;
    }
    if (e.key == "Left" || e.key == "ArrowLeft"){
        leftPressed = true;
    }
}
function keyUpHandler(e){
    if (e.key == "Right" || e.key == "ArrowRight" ){
        rightPressed = false;
    }
    if (e.key == "Left" || e.key == "ArrowLeft" ){
        leftPressed = false;
    }
        
}

var interval = setInterval(draw,10);
