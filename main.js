enchant();

var gsettings = {
  width:320,
  height:320,
  fps:20
};

var SCORE = 000;
var TIME = 30;
var LIFE = 5;

window.onload = function() {
  game = new Game(gsettings.width, gsettings.height);
  game.fps = gsettings.fps;
  game.life = LIFE;
  game.time  = TIME;
  game.score = SCORE;
  var label;
  game.preload(['http://jsrun.it/assets/k/r/t/X/krtXz.gif',
                'http://jsrun.it/assets/v/1/a/l/v1alF.gif',
                'http://jsrun.it/assets/e/B/C/G/eBCGr.gif',
                'http://enchantjs.com/assets/images/bg/bg02.jpg']);
  game.onload = function() {    

  game.makeScene_finish = function() {
    var finish_Scene = new Scene();
    var text = new Label();
    text.text = "SCORE";
    text.textAlign = "center";
    text.y = (game.height / 2) - 90;
    text.font = "100px monospace";
    var score = new Label();
    score.text = game.score;
    score.color = "green";
    score.y = game.height / 2;
    score.textAlign = "center";
    score.font = "100px monospace";
    var bg = new Sprite(320, 320);
    bg.image = game.assets['http://enchantjs.com/assets/images/bg/bg02.jpg'];
    finish_Scene.addChild(bg);
    finish_Scene.addChild(text);
    finish_Scene.addChild(score);
    return finish_Scene;
  }; 

    bear = new Sprite(32, 32);
    bear.image = game.assets['http://jsrun.it/assets/k/r/t/X/krtXz.gif'];
    bear.x = 160;
    bear.y = 200;
    bear.frame = 0;
    game.rootScene.addChild(bear);
    label = new Label("");
    label.x =0;
    label.y =17;
    game.rootScene.addChild(label);
    game.time = game.fps * game.time;
    game.rootScene.addEventListener('touchmove', function(move){
      bear.y = move.localY -50;
      bear.x = move.localX -20;
    });
    count = 0;
    game.rootScene.addEventListener('enterframe',function(){
      if(game.frame % 4 == 0){ bear.frame = game.frame % 3;}
      if(game.frame % 10 == 0){
        if (game.frame % 3 == 0) {additem(14);}
        else if (game.frame % 7 == 0) {additem(30);}
        else{additem(24);}
        label.text = "スコア" + game.score + "<br>残り時間" + Math.floor(game.time / game.fps) +"秒";
      }
      game.time --;
      game.frameCount ++;
      if (game.life == 0){game.pushScene(game.makeScene_finish());}
      if (game.time == 0){game.pushScene(game.makeScene_finish());}});
    setLifes();
  }
  game.start();
}

function additem(item_frame){
  var item = new Sprite(16, 16);
  item.image = game.assets['http://jsrun.it/assets/v/1/a/l/v1alF.gif'];
  item.x = rand(304);
  item.y = 0;
  item.frame = item_frame;
  item.addEventListener('enterframe', function() {
    if(this.intersect(bear)){
      if (item.frame == 14) {
        game.rootScene.removeChild(this);
        game.score +=  10;
      }
      else if (item.frame == 30) {
        game.rootScene.removeChild(this);
        game.score +=  50;
      }
      else if (item.frame == 24){
        game.rootScene.removeChild(this);
        game.life --;
        life.width = 16 * game.life;}
    }else{this.y += 2;}});
  count++;
  game.rootScene.addChild(item);
}
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
