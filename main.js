enchant();

var gsettings = {
  width:320,
  height:320,
  fps:20
};

var game,player;
var SCORE = 0;
var TIME = 30;
var LIFE = 5;

var BaseLabel = Class.create(Label,{
  initialize:function(text,x,y,color){
    Label.call(this,text);
    this.textAlign = "center";
    this.font = "100px monospace";
    this.x = x || 0;
    this.y = y || 0;
    this.color = color || 'black';
  }
});

var EndingScene = Class.create(Scene,{
  initialize:function(){
    Scene.call(this);
    this.addChild(this.background());
    this.addChild(this.title());
    this.addChild(this.score());
  },
  background:function(){
    var background = new Sprite(320, 320);
    background.image = game.assets['http://enchantjs.com/assets/images/bg/bg02.jpg'];
    return background;
  },
  title:function(){
    var text = "SCORE";
    var x = 0;
    var y = (game.height / 2) - 90;
    return new BaseLabel(text,x,y);
  },
  score:function(){
    var text = game.score.toString();
    var x = 0;
    var y = (game.height / 2);
    var color = 'green';
    return new BaseLabel(text,x,y,color);
  }
});

var Player = Class.create(Sprite,{
  initialize:function(){
    Sprite.call(this,32,32);
    this.image = game.assets['http://jsrun.it/assets/k/r/t/X/krtXz.gif'];
    this.x = 160;
    this.y = 200;
    this.frame = 0;
    game.rootScene.addChild(this);
  },
  onenterframe:function(){
    if(game.frame % 4 == 0){ 
      this.frame = game.frame % 3;
    }
  }
});

var Info = Class.create(Label,{
  initialize:function(){
    Label.call(this);
    this.x = 0;
    this.y = 17;
    game.rootScene.addChild(this);
  },
  onenterframe:function(){
    if(game.frame % 10 === 0){
      this.text = [
        "スコア"
        , game.score 
        , "<br>残り時間"
        , Math.floor(game.time / game.fps) + "秒"
      ].join("");
    }
  }
});

window.onload = function() {
  game = new Game(gsettings.width, gsettings.height);
  game.fps = gsettings.fps;
  game.life = LIFE;
  game.time  = TIME;
  game.score = SCORE;

  game.preload(['http://jsrun.it/assets/k/r/t/X/krtXz.gif',
    'http://jsrun.it/assets/v/1/a/l/v1alF.gif',
    'http://jsrun.it/assets/e/B/C/G/eBCGr.gif',
    'http://enchantjs.com/assets/images/bg/bg02.jpg']);

  game.onload = function() {    

    player = new Player();
    new Info();
    game.time = game.fps * game.time;
    game.rootScene.addEventListener('touchmove', function(move){
      player.y = move.localY -50;
      player.x = move.localX -20;
    });
//    count = 0;
    game.rootScene.addEventListener('enterframe',function(){
      
      if(game.frame % 10 == 0){
        if (game.frame % 3 == 0) {new Coin();}
        else if (game.frame % 7 == 0) {new Star();}
        else{new Bomb();}
        
      }
      game.time--;
//      game.frameCount ++;
      if (game.life == 0){game.pushScene(new EndingScene());}
      if (game.time == 0){game.pushScene(new EndingScene());}
    });
    setLifes();
  }
  game.start();
}

var Item = Class.create(Sprite,{
  initialize:function(){
    Sprite.call(this,16,16);
    this.image = game.assets['http://jsrun.it/assets/v/1/a/l/v1alF.gif'];
    this.x = rand(gsettings.width - this.width);
    this.y = 0;
    this.score = 0;
    this.speed = 2;
    game.rootScene.addChild(this);
  },
  move:function (){
    this.y += this.speed;
  },
  remove:function() {
    game.rootScene.removeChild(this);
  },
  onenterframe:function(){
    if(this.intersect(player)){
      game.score += this.score;
      this.remove();
    }
    this.move();
  }
});

var Coin = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 14;
    this.score = 10;
  }
});

var Star = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 30;
    this.score = 50;
  }
});

var Bomb = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 24;
  },
  onenterframe:function(){
    if(this.intersect(player)){
        game.life --;
        life.width = 16 * game.life;
        this.remove();
    }
    this.move();
  }
});

function rand(num){
  return Math.floor(Math.random() * num);
}
function setLifes(){
  life = new Sprite(16 * game.life,16);
  life.image = game.assets['http://jsrun.it/assets/e/B/C/G/eBCGr.gif'];
  life.set = function(num){
    game.life = num;
    this.width = 16 * 3;}
    game.rootScene.addChild(life);
  }
