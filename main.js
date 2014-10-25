enchant();

var gsettings = {
  width:320,
  height:320,
  fps:20
}
,game,player; // グローバルオブジェクト

// Playerクラス
var Player = Class.create(Sprite,{
  initialize:function() {
    Sprite.call(this,32,32);
    this.image = game.assets['http://jsrun.it/assets/k/r/t/X/krtXz.gif'];
    this.x = 160;
    this.y = 200;
    this.frame = 0;
    game.rootScene.addChild(this);
  },// アニメーション
  onenterframe:function() {
    if (game.frame % 4 == 0) { 
      this.frame = game.frame % 3;
    }
  }
});

// アイテムクラス(スーパークラス)
var Item = Class.create(Sprite,{
  initialize:function() {
    Sprite.call(this,16,16);
    this.image = game.assets['http://jsrun.it/assets/v/1/a/l/v1alF.gif'];
    this.x = rand(gsettings.width - this.width); // 出現場所をランダムに
    this.y = 0;
    this.score = 0;   // 得点
    this.speed = 2;   // 動くスピード
    game.rootScene.addChild(this);

    function rand(num){
      return Math.floor(Math.random() * num);
    }
}

  }, 
  // アイテムの移動
  move:function () {
  //TODO 現在は下に移動しているだけ! 動きに変化を 
    this.y += this.speed;
  }, 
  // 自分自身を削除
  remove:function() {
    game.rootScene.removeChild(this);
  },
  // フレーム毎に動くイベント
  onenterframe:function(){
    if(this.intersect(player)){ // プレイヤーと接触したら
      game.score += this.score; // アイテムに応じて得点を加算
      this.remove();            // 画面上から消す
    }
    this.move();                // 移動
  }
});

// コインクラス(アイテムクラスを拡張)
var Coin = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 14;   // コイン画像のインデックス
    this.score = 10;   // 加算される得点
  }
});

// スタークラス(アイテムクラスを拡張)
var Star = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 30;   // スター画像のインデックス
    this.score = 50;   // 加算される得点
  }
});

// 爆弾クラス(アイテムクラスを拡張)
var Bomb = Class.create(Item,{
  initialize:function(){
    Item.call(this);
    this.frame = 24;   // 爆弾画像のインデックス
  },
  // アイテムクラスのイベントをオーバーライド(上書き)
  onenterframe:function(){
    if(this.intersect(player)){
        game.life --;
        this.remove();
    }
    this.move();
  }
});

// インフォメーションクラス(ラベルクラスを エクステンド(拡張))
var Info = Class.create(Label,{
  initialize:function(){
    Label.call(this);
    this.x = 0;
    this.y = 17;
    game.rootScene.addChild(this);
  },
  // 0.5秒毎にインフォメーション(得点，残り時間)を書き換え
  onenterframe:function() {
    var msec = (game.frame / game.fps) * 1000;
    if (msec % 500 === 0) { //500ミリ(0.5)秒
      this.text = [
        "スコア:"
        , game.score
        , "<br>残り時間"
        , Math.floor(game.time / game.fps) + "秒"
      ].join("");
    }
  }
});

// ライフラベルクラス 残りライフを表示
var Life = Class.create(Sprite,{
  initialize:function(){
    Sprite.call(this,game.life * 16,16);
    this.image = 
      game.assets['http://jsrun.it/assets/e/B/C/G/eBCGr.gif'];
    game.rootScene.addChild(this);
  },
  // フレーム毎に表示を書き換え
  onenterframe:function(){
    this.width = game.life * 16;
  }
});

// エンディングシーンに使うラベルのスーパークラス 
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

// エンディングシーンクラス
var EndingScene = Class.create(Scene,{
  initialize:function(){
    Scene.call(this);
    this.addChild(this.background()); // 背景をセット
    this.addChild(this.title());      // タイトルを表示
    this.addChild(this.score());      // 得点をを表示
  },
  // 背景用スプライトの生成
  background:function() {
    var background = new Sprite(320, 320);
    background.image = game.assets['http://enchantjs.com/assets/images/bg/bg02.jpg'];
    return background;
  },
  // タイトル用ラベルの生成
  title:function() {
    var text = 'SCORE';
    var x = 0;
    var y = (game.height / 2) - 90;
    return new BaseLabel(text,x,y);
  },
  // 得点用ラベルの生成
  score:function() {
    var text = game.score.toString();
    var x = 0;
    var y = (game.height / 2);
    var color = 'green';
    return new BaseLabel(text,x,y,color);
  }
});

// ブラウザのロードイベント
window.onload = function() {
  game = new Game(gsettings.width, gsettings.height);
  game.fps = gsettings.fps;  // frame per second(一秒毎のフレームレート)
  game.time = game.fps * 30; // 残り時間(フレーム)
  game.score = 0;            // 初期得点
  game.life = 5;             // 初期ライフ
  // 画像のロード
  game.preload(['http://jsrun.it/assets/k/r/t/X/krtXz.gif',
    'http://jsrun.it/assets/v/1/a/l/v1alF.gif',
    'http://jsrun.it/assets/e/B/C/G/eBCGr.gif',
    'http://enchantjs.com/assets/images/bg/bg02.jpg']);

  // ゲームのロードイベント
  game.onload = function() {

    new Info();             // インフォメーションを配置
    new Life();             // ライフボードを配置
    player = new Player();  // プレイヤーを配置

    // 画面をクリックすることでプレイヤーを移動
    game.rootScene.addEventListener('touchmove', function(e){
      player.y = e.localY -50;
      player.x = e.localX -20;
    });

    // 画面のエンターフレームイベント
    game.rootScene.addEventListener('enterframe',function(){      

      // ゲーム終了条件判定
      if (isEnd()){
        game.pushScene(new EndingScene()); //エンディングシーンに遷移
      }

      // 画面上にアイテム(金貨，星，爆弾)を配置
      emergeItem();

      // アイテム配置関数
      function emergeItem() { // TODO:ItemFactoryから生成すべし
        if (game.frame % 30 === 0) { 
          new Coin(); // 30フレーム毎に金貨を生成
        } else if (game.frame % 70 === 0) { 
          new Star(); // 70フレーム毎に金貨を生成
        } else if (game.frame % 10 === 0) {
          new Bomb(); // 上記を除く10フレーム毎に爆弾を生成
        }
      }

      // ゲーム終了判定関数(@return boolean)
      function isEnd(){
        return (
          game.life === 0 || --game.time === 0);
      }
    });
  }

  game.start();
}