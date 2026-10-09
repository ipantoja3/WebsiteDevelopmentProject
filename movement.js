const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

async function fontLoader(){
    const font = new FontFace('Custom','url(KARNIVOR.ttf)');
    await font.load();
    document.fonts.add(font);
}

fontLoader();

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

let pSpeedX = 5;
let pSpeedY = 0;
let gravity = 1.5;
let jumps = 1;
let jumpsUsed = 0;
let upgradeRotation = 0;
let superDash = false;
let superDashActive = false;

class Platform{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
    }
}

class Upgrade{
    constructor(x,y,width,height,color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color=color;
    }
}

class Upgrade2{
    constructor(x,y,width,height,color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color=color;
    }
}

class Upgrade3{
    constructor(x,y,width,height,color){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;
        this.color=color;
    }
}

class Message{
    constructor(x,y,font,text){
        this.x=x;
        this.y=y;
        this.font=font;
        this.text=text;
    }
}

const world = {width:10000, height:10000}
const player = {x:100, y:9900, width:50, height:50, rotation:0}
const platforms = [
    new Platform(0, 9950, world.width, 50),
    new Platform(300,9800,200,50),
    new Platform(800,8600,200,900),
    new Platform(800,9700,200,500),
    new Platform(850,9825,200,250),
    new Platform(1150,9600,200,50),
    new Platform(1400,9450,200,50),
    new Platform(900,9300,200,50),
    new Platform(1150,9150,200,50),
    new Platform(1750,9150,200,50),
    new Platform(1950,9000,200,50),
    new Platform(1750,8850,200,50),
    new Platform(1250,8750,200,50),
    new Platform(600,8350,200,50),
    new Platform(400,8050,200,50),
    new Platform(1100,7750,200,50),
    new Platform(2100,7750,200,50),
    new Platform(2400,7950,200,50),
    new Platform(3000,8150,200,50),
    new Platform(3600,7950,200,50),
    new Platform(4600,7850,200,50),
    new Platform(5000,7650,200,50),
    new Platform(5750,7450,200,50),
    new Platform(6000,7500,200,50),
    new Platform(6250,7550,200,50),
    new Platform(6700,7600,200,50),
    new Platform(7300,7400,200,50),
    new Platform(7700,7100,200,50),
    new Platform(8000,6800,200,50),
    new Platform(8700,6850,200,50),
    new Platform(9100,6550,200,50),
    new Platform(9400,6250,200,50),
    new Platform(9100,5950,200,50),
    new Platform(8800,5650,200,50),
    new Platform(8500,5350,200,50),
    new Platform(7500,5250,200,50),
    new Platform(7250,5350,200,50),
    new Platform(6450,5350,200,500),
    new Platform(6450,4400,200,750),
    new Platform(5850,5750,200,1000),
    new Platform(5850,4050,200,1500),
    new Platform(5050,5550,200,500),
    new Platform(5750,5250,200,50),
    new Platform(4550,4950,200,550),
    new Platform(3950,4350,200,500),
    new Platform(5350,4650,200,50),
    new Platform(6250,3750,200,50),
    new Platform(6500,3450,200,50),
    new Platform(7200,3150,200,50),
    new Platform(7900,2850,200,50),
    new Platform(7200,2550,200,50),
    new Platform(6950,2250,200,50),
    new Platform(6950,1950,200,50),
    new Platform(6950,1650,200,50),
    new Platform(6250,1350,200,50),
    new Platform(6950,1050,200,50),
    new Platform(7650,750,200,50),
    new Platform(6950,450,200,50),
    new Platform(6950,150,200,50)
]
const upgrades = [
    new Upgrade(850,8400,100,100,'#8DACC2')
]

const upgrades2 = [
    new Upgrade2(7300,5150,100,100,'#CC7568')
]

const upgrades3 = [
    new Upgrade3(7025,75,50,50,'#83eb8c')
]

const messages = [
    new Message(400,9700,'40px Custom','Shift to dash'),
    new Message(850,8300,'40px Custom','Double jump'),
    new Message(1150,7700,'60px Custom','--->'),
    new Message(3650,7900,'60px Custom','--->'),
    new Message(8550,5300,'60px Custom','<---'),
    new Message(6850,5250,'40px Custom','Hold Shift'),
    new Message(6962.5,50,'40px Custom','You Win')
]

let aPressed = false;
let dPressed = false;
let jumpPressed = false;
let jumpDuration = 0;
let dashPressed = false;
let dashCooldown = false;
let grounded = true;

window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'a'){
        aPressed=true;
    }
})
window.addEventListener('keyup', (e) => {
    if(e.key.toLowerCase() === 'a'){
        aPressed=false;
    }
})

window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'd'){
        dPressed=true;
    }
})
window.addEventListener('keyup', (e) => {
    if(e.key.toLowerCase() === 'd'){
        dPressed=false;
    }
})

window.addEventListener('keydown', (e) => {
    if(e.key.toLowerCase() === 'w'){
        if(e.repeat || jumpPressed || jumpsUsed===jumps) return;
        jumpPressed=true;
        jumpsUsed+=1
        jumpDuration=0;
        pSpeedY=15;
        grounded=false;
    }
})
window.addEventListener('keyup', (e) => {
    if(e.key.toLowerCase() === 'w'){
        jumpPressed=false;
    }
})

window.addEventListener('keydown', (e) => {
    if(e.key === 'Shift'){
        if(!superDash){
            if(dashPressed || dashCooldown) return;
            pSpeedX=50;
            dashPressed=true;
            dashCooldown=setTimeout(() => {
                dashCooldown=false;
            }, 500)
        } else {
            pSpeedX=25;
            superDashActive=true;
        }
    }
})
window.addEventListener('keyup', (e) => {
    if(e.key === 'Shift'){
        dashPressed=false;
        if(superDashActive){superDashActive=false}
    }
    
})

function pLeft(){
    player.x-=pSpeedX;
}
function pRight(){
    player.x+=pSpeedX;
}

function movementX(){
    prevX=player.x
    if(aPressed){pLeft()}
    if(dPressed){pRight()}
}

function movementY(){
    prevY=player.y
    if(jumpPressed && jumpDuration < 5){
        pSpeedY += 2;
        jumpDuration += 1;
    } 
    if(pSpeedX > 5 && !superDashActive){
        pSpeedX-=5;
        pSpeedY=0;
    } else if(superDashActive){
        pSpeedY=0;
    } else {
        pSpeedY-=gravity
        player.y-=pSpeedY
    }
}

function xCollisionCheck(rect1, rect2){
    return rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x;
}

function xCollision(rect1,rect2){
    if(xCollisionCheck(rect1,rect2) && yCollisionCheck(rect1,rect2)){
        if(rect2.x > prevX){
            rect1.x=rect2.x-rect1.width;
        } 
        if(rect2.x < prevX){
            rect1.x=rect2.x+rect2.width;
        } 
    }
}

function yCollisionCheck(rect1, rect2){
    return rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y;
}

function yCollision(rect1,rect2){
    if(yCollisionCheck(rect1,rect2) && xCollisionCheck(rect1,rect2)){
        if(pSpeedY <= 0){
            rect1.y=rect2.y-rect1.height;
            pSpeedY=0;
            grounded=true;
        } else if (pSpeedY > 0){
            rect1.y=rect2.y+rect2.height
            pSpeedY=0
        }
    }
    if(grounded){
        jumpsUsed=0;
    }
}

function render(){
    ctx.fillStyle="white";
    if(jumpsUsed==2){ctx.fillStyle="#8DACC2"}
    if(superDashActive){ctx.fillStyle="#CC7568"}
    if(jumpsUsed>2){ctx.fillStyle="#83eb8c"}
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0,0,canvas.width,canvas.height);
    const camX=Math.max(0, Math.min(player.x-canvas.width/2, world.width-canvas.width));
    const camY=Math.max(0, Math.min(player.y-canvas.height/2, world.height-canvas.height));
    ctx.translate(-camX,-camY);
    ctx.save();
    if(grounded){player.rotation=0} else if(aPressed){player.rotation-=5}else{player.rotation+=5}
    ctx.translate(player.x+player.width/2, player.y+player.height/2);
    ctx.rotate(player.rotation*(Math.PI/180));
    ctx.fillRect(-(player.width/2),-(player.height/2),player.width,player.height);
    ctx.restore();
    platforms.forEach(platform => {
        ctx.fillStyle="#323232";
        ctx.fillRect(platform.x,platform.y,platform.width,platform.height);
    });
    ctx.save()
    upgrades.forEach(upgrade => {
        upgradeRotation+=6;
        if(upgradeRotation>=360){upgradeRotation=0}
        ctx.translate(upgrade.x+upgrade.width/2, upgrade.y+upgrade.height/2);
        ctx.rotate(upgradeRotation*(Math.PI/180));
        ctx.fillStyle=upgrade.color;
        ctx.fillRect(-(upgrade.width/2),-(upgrade.height/2),upgrade.width,upgrade.height);
    })
    ctx.restore()
    ctx.save()
    upgrades2.forEach(upgrade2 => {
        ctx.translate(upgrade2.x+upgrade2.width/2, upgrade2.y+upgrade2.height/2);
        ctx.rotate(upgradeRotation*(Math.PI/180));
        ctx.fillStyle=upgrade2.color;
        ctx.fillRect(-(upgrade2.width/2),-(upgrade2.height/2),upgrade2.width,upgrade2.height);
    })
    ctx.restore()
    ctx.save()
    upgrades3.forEach(upgrade3 => {
        ctx.translate(upgrade3.x+upgrade3.width/2, upgrade3.y+upgrade3.height/2);
        ctx.rotate(upgradeRotation*(Math.PI/180));
        ctx.fillStyle=upgrade3.color;
        ctx.fillRect(-(upgrade3.width/2),-(upgrade3.height/2),upgrade3.width,upgrade3.height);
    })
    ctx.restore()
    messages.forEach(message => {
        ctx.fillStyle="white";
        ctx.font=message.font;
        ctx.fillText(message.text,message.x,message.y);
    })
}

function gameLoop(){
    movementX()
    platforms.forEach(platform => {
        xCollision(player,platform);
    });
    movementY()
    grounded=false;
    platforms.forEach(platform => {
        yCollision(player,platform);
    })
    upgrades.forEach(upgrade => {
        if(xCollisionCheck(player,upgrade)&&yCollisionCheck(player,upgrade)){jumps=2}
    })
    upgrades2.forEach(upgrade2 => {
        if(xCollisionCheck(player,upgrade2)&&yCollisionCheck(player,upgrade2)){superDash=true; jumps=2}
    })
    upgrades3.forEach(upgrade3 => {
        if(xCollisionCheck(player,upgrade3)&&yCollisionCheck(player,upgrade3)){superDash=true; jumps=10000}
    })
    render();
    requestAnimationFrame(gameLoop)
}

requestAnimationFrame(gameLoop);
