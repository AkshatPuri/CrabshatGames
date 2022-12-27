$("#gamecanvasID").hide();
function loadCanvas(){
    $("#gamecanvasID").show();
}
//Play in full page 

window.addEventListener("DOMContentLoaded",game);

//General sprite load
const sprite = new Image();
const spriteplanet = new Image();
const spriteExplosion = new Image();
const spriteBullet = new Image();
const spriteasteroid = new Image();
sprite.src = 'gameimg/sprite.png';
window.onload = function() {
    
 spriteExplosion.src = 'gameimg/explosion.png';
 spriteplanet.src ='gameimg/spriteplanet.png';
 spriteBullet.src ='gameimg/bullet.png';
 spriteasteroid.src ='gameimg/asteroid.png';
};


function game() {

    var canvas = document.getElementById('gamecanvasID'),
    ctx    = canvas.getContext('2d'),
    cH     = ctx.canvas.height = window.innerHeight,
    cW     = ctx.canvas.width  = window.innerWidth;



    var bullets= [],
    asteroids  = [],
    explosions = [],
    destroyed  = 0,
    record     = 0,
    count      = 0,
    playing    = false,
    gameOver   = false,
    _planet    = {deg: 0};


    var player = {
        posX   : -35,
        posY   : -(5+100),
        width  : sprite.width*0.2,
        height : sprite.height*0.2,
        deg    : 0
    };

     canvas.addEventListener('click', action);
     canvas.addEventListener('mousemove', action);
     window.addEventListener('resize', update);



     //Update canvas 
    function update() {
        cH= ctx.canvas.height = window.innerHeight;
        cW= ctx.canvas.width  = window.innerWidth ;

        //  ctx.fillStyle = '#F9DC5C';
        //  ctx.fillRect(ctx.canvas.width*0.5,ctx.canvas.height*0.5,ctx.canvas.width*0.3,ctx.canvas.height*0.3);
    }

    function move(e) {
  
        player.deg = Math.atan2(e.clientX - (cW/2), -(e.clientY - (cH/2)));        
    }
   
     //Actions
     function action(e) {
        e.preventDefault();
        if(playing) {
            var bullet = {
                x: -8,
                y: -70,
                sizeX : 2,
                sizeY : 10,
                realX : e.clientX,
                realY : e.clientY,
                dirX  : e.clientX,
                dirY  : e.clientY,
                deg   : Math.atan2(e.clientX - (cW/2), -(e.clientY - (cH/2))),
                destroyed: false
            };

            bullets.push(bullet);
        } else {
            var dist;
            if(gameOver) {
                dist = Math.sqrt(((e.clientX - cW/2) * (e.clientX - cW/2)) + ((e.clientY - (cH/2 + 45 + 22)) * (e.clientY - (cH/2+ 45 + 22))));
                if (dist>-600||dist < 600) {
                    if(e.type == 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        asteroids  = [];
                        explosions = [];
                        destroyed  = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.clientX - cW/2) * (e.clientX- cW/2)) + ((e.clientY - cH/2) * (e.clientY - cH/2)));

                if (dist>-600|| dist < 600) {
                    if(e.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }
   
    function fire() 
    {
        var distance;

        for(var i = 0; i < bullets.length; i++) 
        {
            if(!bullets[i].destroyed) {
                ctx.save();
                ctx.translate(cW/2,cH/2);
                ctx.rotate(bullets[i].deg);
                ctx.shadowBlur    = 50;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor   = "#FFFFFF";
                ctx.drawImage(
                    spriteBullet,
                    0,
                    0,
                    spriteBullet.width,
                    spriteBullet.height,
                    bullets[i].x,
                    bullets[i].y -= 25,
                    20,
                    20
                );

                ctx.restore();

                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW/2;
                bullets[i].realY += cH/2;

                for(var j = 0; j < asteroids.length; j++) 
                {
                    if(!asteroids[j].destroyed) {
                        distance = Math.sqrt(Math.pow(
                            asteroids[j].realX - bullets[i].realX, 2) +
                            Math.pow(asteroids[j].realY - bullets[i].realY, 2)
                        );

                        if (distance < (((asteroids[j].width/asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed   = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }

            }
        }

    }

    function planet() {
        ctx.save();
        ctx.fillStyle   = 'white';
        ctx.shadowBlur    = 200;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor   = "#d5823e";

        ctx.arc(
            (cW/2),
            (cH/2),
            50,
            0,
            Math.PI * 2
        );
        ctx.fill();

        //Planet rotation
        ctx.translate(cW/2,cH/2);
        ctx.rotate((_planet.deg += 1) * (Math.PI / 180));
        ctx.drawImage(spriteplanet, 0, 0, spriteplanet.width, spriteplanet.height, -spriteplanet.width*0.5, -spriteplanet.height*0.5,spriteplanet.width,spriteplanet.height);
        ctx.restore();
    }



    function _player() {

        ctx.save();
        ctx.translate(cW/2,cH/2);

        player.width=sprite.width;
        player.height=sprite.height;

        ctx.rotate(player.deg);
        ctx.drawImage(
            sprite,
            0,
            0,
            sprite.width,
            sprite.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );

        
    
        ctx.restore();

        

        if(bullets.length - destroyed && playing) {
            fire();
        }
    }


    function newAsteroid() {

        var type = random(1,4),
            coordsX,
            coordsY;

        switch(type){
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                break;
        }

        var asteroid = {
            x: 0,
            y: 0,
            state: 0,
            stateX: 0,
            width: 120,
            height: 120,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: random(2, 4),
            deg: Math.atan2(coordsX  - (cW/2), -(coordsY - (cH/2))),
            destroyed: false
        };
        asteroids.push(asteroid);
    }

    function _asteroids() {
        var distance;

        for(var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save();
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);
                ctx.shadowBlur    = 50;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor   = "#d5823e";
                ctx.drawImage(
                    spriteasteroid,
                    asteroids[i].x,
                    asteroids[i].y,
                    spriteasteroid.width,
                    spriteasteroid.height,
                    -(asteroids[i].width / asteroids[i].size) / 2,
                    asteroids[i].moveY += 1/(asteroids[i].size),
                    asteroids[i].width / asteroids[i].size,
                    asteroids[i].height / asteroids[i].size
                );

                ctx.restore();

                //Real Coords
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX;
                asteroids[i].realY += asteroids[i].coordsY;

                //Game over
                distance = Math.sqrt(Math.pow(asteroids[i].realX -  cW/2, 2) + Math.pow(asteroids[i].realY - cH/2, 2));
                if (distance < (((asteroids[i].width/asteroids[i].size) / 2) - 4) + spriteplanet.width*0.5) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if(!asteroids[i].extinct) {
                explosion(asteroids[i]);
            }
        }

        if(asteroids.length - destroyed < 10 + (Math.floor(destroyed/6))) {
            newAsteroid();
        }
    }


    function explosion(asteroid) {
        ctx.save();
        ctx.translate(asteroid.realX, asteroid.realY);
        ctx.rotate(asteroid.deg);

        var spriteY,
            spriteX = 256;
        if(asteroid.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if(asteroid.state < 16) {
            spriteY = 256;
        } else if(asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if(asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0;
        }

        ctx.drawImage(
            spriteExplosion,
            asteroid.stateX += spriteX,
            spriteY,
            256,
            256,
            - (asteroid.width / asteroid.size)/2,
            -(asteroid.height / asteroid.size)/2,
            asteroid.width / asteroid.size,
            asteroid.height / asteroid.size
        );
        asteroid.state += 1;

        if(asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore();
    }

    function start() 
    {
        if(!gameOver) 
        {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            //Planet
            planet();

            //Player
            _player();


            if(playing) {
                _asteroids();

                ctx.font = "20px Helvetica";
                ctx.fillStyle = "#d5823e";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('RECORD: '+record+'', 20, 30);

                ctx.font = "30px Helvetica";
                ctx.fillStyle = "#d5823e8c";
               
              
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
              
                ctx.fillText(''+destroyed+'', cW/2,cH/2);

            } 
            else 
            {
            ctx.drawImage(sprite, 428, 12, 70, 70, cW/2 - 35, cH/2 - 35, 70,70);
            }
        }
        else if(count < 1) 
        {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "60px Helvetica";
            ctx.fillStyle = "#d5823e";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",cW/2,cH/2 - 150);

            ctx.font = "40px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("TOTAL DESTROYED: "+ destroyed, cW/2,cH/2 + 100);

            record = destroyed > record ? destroyed : record;

            ctx.font = "40px Helvetica";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("RECORD: "+ record, cW/2,cH/2 + 185);

           // ctx.drawImage(sprite, 500, 18, 70, 70, cW/2 - 35, cH/2 + 40, 70,70);

            canvas.removeAttribute('class');
        }

    }


    function init() {
    
        window.requestAnimationFrame(init);
        start()

    }

    init()

   //Utils
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }


}