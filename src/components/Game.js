import * as React from "react";
import { browserHistory } from "react-router";
import * as PIXI from "pixi.js";
import PIXI_SOUND from "pixi-sound";
window.PIXI = PIXI;
require("pixi-layers");
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {
  getSize,
  getScale,
  logo,
  startTextStyle,
  labelStyle,
  stage1_bg,
  stars,
  keyCode,
  clown_move,
  clown_die,
  clown_win,
  clown_on_lion_walk,
  clown_on_lion_idle,
  clown_on_lion_jump,
  lion_walk,
  lion_idle,
  lion_die,
  lion_jump,
  fireHoopLL,
  fireHoopLR,
  destination,
  audio_stage1,
  audio_rip,
  audio_win,
  firePit,
} from "../config.js";
import Keyboard from "../utils/keyboard";

let { width, height } = getSize();

HTMLElement.prototype.pressKey = function (code) {
  var evt = document.createEvent("UIEvents");
  evt.keyCode = code;
  evt.initEvent("keydown", true, true);
  this.dispatchEvent(evt);
};

HTMLElement.prototype.releaseKey = function (code) {
  var evt = document.createEvent("UIEvents");
  evt.keyCode = code;
  evt.initEvent("keyup", true, true);
  this.dispatchEvent(evt);
};

class Game extends React.Component {
  nextStatus = "idle_after_jump";
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.app = this.props.data.store.pixi;
    if (this.app) {
      gsap.registerPlugin(PixiPlugin);
      PixiPlugin.registerPIXI(PIXI);
      this.initGame();
    } else {
      browserHistory.push("/");
    }
  }

  initGame() {
    this.app.stage.sortableChildren = true;
    const timeline = gsap.timeline();

    // audio
    this.audio_01 = PIXI_SOUND.sound.Sound.from(audio_stage1);
    this.audio_rip = PIXI_SOUND.sound.Sound.from(audio_rip);
    this.audio_win = PIXI_SOUND.sound.Sound.from(audio_win);

    // add title
    const titleX = width / 2;
    const titleY = height / 3.3;

    let titleBorder = this.getSprite(stars, { scale: 1.5 });
    titleBorder.position.set(titleX, titleY);
    this.app.stage.addChild(titleBorder);
    timeline.to(titleBorder, {
      yoyo: true,
      alpha: 0.4,
      duration: 0.7,
      repeat: -1,
    });

    let title = this.getSprite(logo, { scale: 0.25 });
    title.position.set(titleX, titleY);
    this.app.stage.addChild(title);

    // add start text
    this.addText(
      "PRESS ENTER TO START",
      this.getStartTextPos(),
      startTextStyle
    );

    // add clown move
    let clown = new PIXI.AnimatedSprite(clown_move);
    clown.position.set(-clown.width, height / 1.3);
    this.app.stage.addChild(clown);
    clown.animationSpeed = 0.1;
    clown.play();

    timeline.to(clown, {
      x: width + clown.width,
      repeat: -1,
      duration: 8,
      ease: "sine.inOut",
    });

    //keyboard event
    let enter = Keyboard(keyCode.enter);
    enter.press = () => {
      if (this.props.data.store.isRuleShow === false) {
        enter.unsubscribe();
        space.unsubscribe();
        document.getElementById("start").remove();
        document.getElementById("emuEnter").style.opacity = 0;
        document.getElementById("emuW").style.opacity = 1;
        document.getElementById("emuD").style.opacity = 1;
        this.startGame();
        timeline.kill();
      }
    };
    let space = Keyboard(keyCode.space);
    space.press = () => {
      if (this.props.data.store.isRuleShow) {
        this.props.data.hideRule();
        document.getElementById("emuW").style.opacity = 0;
        document.getElementById("emuD").style.opacity = 0;
        document.getElementById("emuEnter").style.opacity = 1;
      } else {
        this.props.data.showRule();
        document.getElementById("emuW").style.opacity = 1;
        document.getElementById("emuD").style.opacity = 1;
        document.getElementById("emuEnter").style.opacity = 0;
      }
    };

    let soundDom = document.getElementById("sound");
    let m = Keyboard(keyCode.m);
    m.press = () => {
      if (soundDom.getAttribute("data") === "on") {
        soundDom.setAttribute("data", "off");
        soundDom.innerText = "Sound On(M)";
        this.audio_01.volume = 0;
        this.audio_rip.volume = 0;
        this.audio_win.volume = 0;
      } else {
        soundDom.setAttribute("data", "on");
        soundDom.innerText = "Mute(M)";
        this.audio_01.volume = 1;
        this.audio_rip.volume = 1;
        this.audio_win.volume = 1;
      }
    };
  }

  async startGame() {
    this.clearCanvas();
    let stage01Text = this.addText(
      "STAGE 01",
      this.getCenter(),
      startTextStyle
    );
    await this.sleep(1500);
    stage01Text.destroy();
    this.stage1Keyboard();
    this.timeline = gsap.timeline();
    this.initStage1();
  }

  initStage1() {
    this.gameInfo = {
      status: "play",
    };
    this.lion = {
      status: "idle",
      jump_direction: 1,
      sprite: null,
      speed: 1.6,
    };
    this.clown = {
      sprite: null,
    };
    this.hoops = [];
    this.pits = [];
    this.labels = [];
    this.dest = [];
    this.distance = { times: 8, module: 0 }; //times 10 = start at 100M

    this.audio_01.loop = true;
    this.audio_01.play();

    this.bg = this.getBackground();
    this.app.stage.addChild(this.bg);

    this.player = this.getPlayer();
    this.app.stage.addChild(this.player);
    this.player.position.set(
      width * 0.05 + this.lion.sprite.width / 2,
      height * 0.908 - this.lion.sprite.y - this.lion.sprite.height / 2
    );

    this.createMeterLabel(this.distance.times * 10);

    this.hoopCountdown = 270;
    this.app.ticker.add(this.stage1Ticker, this);
  }

  stage1Ticker(delta) {
    const hoopFrequency = 360;
    this.hoopCountdown += delta;
    if (this.hoopCountdown > hoopFrequency) {
      this.addHoopL();
      this.hoopCountdown -= hoopFrequency;
    }
    if (
      this.hoops[0] &&
      this.hoops[0].right.x < (this.hoops[0].right.width / 2) * -1
    ) {
      this.hoops[0].left.destroy();
      this.hoops[0].right.destroy();
      this.hoops.shift();
    }
    if (this.pits[0] && this.pits[0].x < (this.pits[0].width / 2) * -1) {
      this.pits[0].destroy();
      this.pits.shift();
    }
    if (this.labels[0] && this.labels[0].x < this.labels[0].width * -1) {
      this.labels[0].destroy();
      this.labels.shift();
    }
    this.hoops.forEach((hoop) => {
      hoop.left.x -= delta * 0.5;
      hoop.right.x -= delta * 0.5;
    });

    if (this.gameInfo.status === "play" && this.lion.status === "walk") {
      this.relatedSpeed(delta);
    } else if (this.gameInfo.status === "play" && this.lion.status === "jump") {
      this.relatedSpeed(delta);
      this.lionSpeedY(delta);
    }

    if (this.gameInfo.status === "play" && this.isDie()) {
      this.app.ticker.remove(this.stage1Ticker, this);
      this.changeLionState("die");
      this.timeline
        .to(this.player, {
          y: this.player.y - 20,
          duration: 0.2,
          delay: 2.5,
        })
        .to(this.player, {
          y: height + this.clown.sprite.height / 2,
          duration: 0.4,
        });
      this.audio_01.stop();
      this.audio_rip.play(() => {
        this.restartStage01();
      });
    }
  }

  stage1FinalTicker(delta) {
    const hoopFrequency = 400;
    this.hoopCountdown += delta;
    if (this.hoopCountdown > hoopFrequency) {
      this.addHoopL();
      this.hoopCountdown -= hoopFrequency;
    }
    if (this.hoops[0] && this.hoops[0].right.x < 0) {
      this.hoops[0].left.destroy();
      this.hoops[0].right.destroy();
      this.hoops.shift();
    }
    this.hoops.forEach((hoop) => {
      hoop.left.x -= delta * 0.5;
      hoop.right.x -= delta * 0.5;
    });

    if (this.gameInfo.status === "play" && this.lion.status === "walk") {
      this.playerSpeed(delta);
    } else if (this.gameInfo.status === "play" && this.lion.status === "jump") {
      this.playerSpeed(delta);
      this.lionSpeedY(delta);
    }

    if (this.player.x > width - 34) {
      this.win();
    } else if (this.gameInfo.status === "play" && this.isDie()) {
      this.app.ticker.remove(this.stage1FinalTicker, this);
      this.changeLionState("die");
      this.timeline
        .to(this.player, {
          y: this.player.y - 20,
          duration: 0.2,
          delay: 2.5,
        })
        .to(this.player, {
          y: height + this.clown.sprite.height / 2,
          duration: 0.4,
        });
      this.audio_01.stop();
      this.audio_rip.play(() => {
        this.restartStage01();
      });
    }
  }

  createPit(x) {
    let temp = this.getAnimatedSprite(firePit);
    temp.animationSpeed = 0.1;
    temp.play();
    temp.position.set(x, height * 0.944 - temp.height / 2);
    this.app.stage.addChild(temp);
    this.pits.push(temp);
  }

  createMeterLabel(num) {
    this.distance.times--;
    let rect = new PIXI.Graphics();
    rect.lineStyle(2, 0xe54156, 1);
    rect.beginFill(0x000000);
    rect.drawRect(0, 0, 29, 13);
    rect.endFill();
    let label = new PIXI.Text(num + "M", labelStyle);
    label.position.set(
      (rect.width - rect.line.width) / 2,
      (rect.height - rect.line.width) / 2
    );
    label.anchor.set(0.5);

    let temp = new PIXI.Container();
    temp.addChild(rect);
    temp.addChild(label);
    this.app.stage.addChild(temp);

    temp.position.set(width + 30, height - 18);
    this.labels.push(temp);

    this.createPit(width);
  }

  createDestination() {
    let temp = this.getAnimatedSprite(destination);
    temp.position.set(
      width + temp.width / 2 + 12,
      height * 0.91 - temp.height / 2
    );
    this.app.stage.addChild(temp);
    this.dest.push(temp);
  }

  restartStage01() {
    this.clearCanvas();
    this.initStage1();
  }

  isDie() {
    const scalePLayer = 0.9;
    const playerArea = {
      x: this.player.x - (this.lion.sprite.width * scalePLayer) / 2,
      y: this.player.y - (this.clown.sprite.height * scalePLayer) / 2,
      width: this.player.width * scalePLayer,
      height: this.player.height * scalePLayer,
    };

    let deathAreaArr = [];
    const hoopThickness = 3;
    const hoopWidth = 10;
    this.hoops.forEach((hoop) => {
      deathAreaArr.push({
        x:
          hoop.left.x - hoop.left.width / 2 + (hoop.left.width - hoopWidth) / 2,
        y: hoop.left.y + hoop.left.height / 2 - hoopThickness,
        width: hoopWidth,
        height: hoopThickness,
      });
    });

    this.pits.forEach((pit) => {
      const scale = 0.7;
      deathAreaArr.push({
        x: pit.x - (pit.width * scale) / 2,
        y: pit.y - (pit.height * scale) / 2,
        width: pit.width * scale,
        height: pit.height * scale,
      });
    });

    for (let i = 0; i < deathAreaArr.length; i++) {
      if (this.isCollision(playerArea, deathAreaArr[i])) {
        return true;
      }
    }

    return false;
  }

  isCollision(rect1, rect2) {
    if (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    ) {
      return true;
    } else {
      return false;
    }
  }

  lionSpeedY(delta) {
    const top = height * 0.45 + this.clown.sprite.height / 2 + 20;
    const bottom =
      height * 0.908 - this.lion.sprite.y - this.lion.sprite.height / 2;
    const mockGravity = 7;
    const speed_y = 0.07 * (this.player.y - top + mockGravity);
    this.player.y -= delta * speed_y * this.lion.jump_direction;
    if (this.player.y < top) {
      this.player.y = top;
      this.lion.jump_direction *= -1;
    }
    if (this.player.y >= bottom) {
      this.player.y = bottom;
      this.lion.jump_direction *= -1;
      this.changeLionState(this.nextStatus);
    }
  }

  playerSpeed(delta) {
    const diff_distance = delta * this.lion.speed;
    this.player.x += diff_distance;
  }

  async win() {
    this.app.ticker.remove(this.stage1FinalTicker, this);
    this.changeLionState("win");
    this.audio_01.stop();
    this.audio_win.play();
    this.timeline.to(this.player, {
      x: width - 26,
      y:
        height * 0.908 -
        this.lion.sprite.height / 2 -
        this.lion.sprite.y -
        this.dest[0].height * 0.78,
      duration: 2,
    });
    await this.sleep(6200);
    this.restartStage01();
  }

  relatedSpeed(delta) {
    const diff_distance = delta * this.lion.speed;
    const distanceBetweenLabel = width * 0.96;

    this.hoopCountdown += diff_distance;

    this.bg.x -= diff_distance;
    this.bg.x = this.bg.x < -width / 2 ? width * 0.5 : this.bg.x;
    this.hoops.forEach((hoop) => {
      hoop.left.x -= diff_distance;
      hoop.right.x -= diff_distance;
    });
    this.pits.forEach((pit) => {
      pit.x -= diff_distance;
    });
    this.labels.forEach((label) => {
      label.x -= diff_distance;
    });
    this.dest.forEach((dest) => {
      dest.x -= diff_distance;
    });
    this.distance.module += diff_distance;

    if (this.distance.module > distanceBetweenLabel) {
      if (this.distance.times === 0) {
        this.createDestination();
      }
      this.createMeterLabel(this.distance.times * 10);
      this.distance.module -= distanceBetweenLabel;
    }

    if (this.distance.times < 0 && this.distance.module > 60) {
      this.app.ticker.remove(this.stage1Ticker, this);
      this.app.ticker.add(this.stage1FinalTicker, this);
    }
  }

  addHoopL() {
    let left = this.getAnimatedSprite(fireHoopLL);
    left.zIndex = 9;
    left.position.set(width + 6, height * 0.45 + left.height / 2);
    left.animationSpeed = 0.1;
    left.play();
    let right = this.getAnimatedSprite(fireHoopLR);
    right.zIndex = 11;
    right.position.set(width + 18, height * 0.45 + right.height / 2);
    right.animationSpeed = 0.1;
    right.play();
    this.app.stage.addChild(left);
    this.app.stage.addChild(right);
    this.hoops.push({ left, right });
  }

  getBackground() {
    let temp1 = this.getSprite(stage1_bg);
    temp1.width = width;
    temp1.height = (width * 552) / 1024;
    let temp2 = this.getSprite(stage1_bg);
    temp2.width = width;
    temp2.height = (width * 552) / 1024;
    temp2.position.set(width, 0);

    let temp = new PIXI.Container();
    temp.addChild(temp1);
    temp.addChild(temp2);
    temp.position.set(0, height - temp.height / 2);
    return temp;
  }

  getPlayer() {
    this.clown.sprite = this.getAnimatedSprite(clown_on_lion_idle);
    this.clown.sprite.position.set(0, 0);
    this.lion.sprite = this.getAnimatedSprite(lion_idle);
    this.lion.sprite.position.set(0, 19);
    let temp = new PIXI.Container();
    temp.addChild(this.clown.sprite);
    temp.addChild(this.lion.sprite);
    temp.zIndex = 10;
    return temp;
  }

  changeLionState(state) {
    const _nextStatus = state.split("_")[0];
    switch (true) {
      case this.lion.status === "die" || this.lion.status === "win":
        return;
      case state === "idle" && this.lion.status === "jump":
        this.nextStatus = "idle_after_jump";
        return;
      case state === "walk" && this.lion.status === "jump":
        this.nextStatus = "walk_after_jump";
        return;

      case _nextStatus === "idle":
        this.nextStatus = "idle_after_jump";
        this.clown.sprite.textures = clown_on_lion_idle;
        this.lion.sprite.textures = lion_idle;
        break;
      case _nextStatus === "walk":
        this.nextStatus = "walk_after_jump";
        this.lion.sprite.textures = lion_walk;
        this.lion.sprite.animationSpeed = 0.08;
        this.lion.sprite.play();
        this.clown.sprite.textures = clown_on_lion_walk;
        this.clown.sprite.animationSpeed = 0.08;
        this.clown.sprite.play();
        break;
      case _nextStatus === "die":
        this.clown.sprite.textures = clown_die;
        this.lion.sprite.textures = lion_die;
        break;
      case _nextStatus === "win":
        this.clown.sprite.textures = clown_win;
        this.clown.sprite.animationSpeed = 0.04;
        this.clown.sprite.play();
        this.lion.sprite.textures = lion_idle;
        break;
      case _nextStatus === "jump":
        this.clown.sprite.textures = clown_on_lion_jump;
        this.lion.sprite.textures = lion_jump;
        break;
    }
    this.lion.status = _nextStatus;
  }

  stage1Keyboard() {
    let right = Keyboard(keyCode.d);
    right.press = () => {
      if (this.gameInfo.status === "play") {
        this.changeLionState("walk");
      }
    };
    right.release = () => {
      this.changeLionState("idle");
    };
    let up = Keyboard(keyCode.w);
    up.press = () => {
      if (this.gameInfo.status === "play") {
        this.changeLionState("jump");
      }
    };
    let space = Keyboard(keyCode.space);
    space.press = () => {
      if (this.lion.status === "win" || this.lion.status === "die") return;

      if (this.gameInfo.status === "play") {
        this.props.data.showRule();
        this.gameInfo.status = "pause";
        this.app.ticker.stop();
        this.audio_01.stop();
      } else if (this.gameInfo.status === "pause") {
        this.props.data.hideRule();
        this.gameInfo.status = "play";
        this.app.ticker.start();
        this.audio_01.play();
      }
    };
  }

  getCenter() {
    return { x: width / 2, y: height / 2 };
  }

  getStartTextPos() {
    return { x: width / 2, y: height / 1.6 };
  }

  getAnimatedSprite(textureArr, options) {
    let temp = new PIXI.AnimatedSprite(textureArr);
    temp.anchor.set(0.5);
    for (let key in options) {
      temp[key].set(options[key]);
    }
    return temp;
  }

  getSprite(url, options) {
    let temp = new PIXI.Sprite(
      this.app.loader.resources[url].texture // get Texture Cache
    );
    temp.anchor.set(0.5);
    for (let key in options) {
      temp[key].set(options[key]);
    }
    return temp;
  }

  addText(text, pos, style) {
    let temp = new PIXI.Text(text, style);
    temp.position.set(pos.x, pos.y);
    temp.anchor.set(0.5);
    this.app.stage.addChild(temp);
    return temp;
  }

  clearCanvas() {
    for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
      this.app.stage.removeChild(this.app.stage.children[i]);
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  componentWillUnmount() {}

  render() {
    let children = this.props.children;

    const isMobile =
      typeof window.orientation !== "undefined" ||
      navigator.userAgent.indexOf("IEMobile") !== -1;
    return (
      <div>
        {children}
        <div
          className="key-emulator key-container"
          style={{ display: isMobile ? "block" : "none" }}
        >
          <div
            id="emuW"
            onTouchStart={() => {
              document.body.pressKey(keyCode.w);
            }}
            onTouchEnd={() => {
              document.body.releaseKey(keyCode.w);
            }}
            className="button"
          >
            ↑
          </div>
          <div
            id="emuEnter"
            onTouchStart={() => {
              document.body.pressKey(keyCode.enter);
            }}
            onTouchEnd={() => {
              document.body.releaseKey(keyCode.enter);
            }}
            className="button"
          >
            ↵
          </div>
          <div
            id="emuSpace"
            onTouchStart={() => {
              document.body.pressKey(keyCode.space);
            }}
            onTouchEnd={() => {
              document.body.releaseKey(keyCode.space);
            }}
            className="button space"
          >
            Spacebar
          </div>
          <div
            id="emuD"
            onTouchStart={() => {
              document.body.pressKey(keyCode.d);
            }}
            onTouchEnd={() => {
              document.body.releaseKey(keyCode.d);
            }}
            className="button"
          >
            →
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
