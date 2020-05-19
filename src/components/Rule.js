import * as React from "react";
import * as PIXI from "pixi.js";
import {
  clown_on_lion_walk,
  clown_on_lion_idle,
  clown_on_lion_jump,
  lion_walk,
  lion_idle,
  lion_jump,
  keyCode,
} from "../config.js";

import Keyboard from "../utils/keyboard";

const ratio = window.devicePixelRatio || 1;
const width = 300 / ratio;
const height = 200 / ratio;

class Rule extends React.Component {
  nextStatus = "idle_after_jump";
  lion = {
    status: "idle",
    jump_direction: 1,
    sprite: null,
    speed: 1.5,
  };
  clown = {
    sprite: null,
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PIXI.utils.clearTextureCache();
    this.initCanvas();
  }

  componentDidUpdate() {
    const isRuleShow = this.props.show;
    if (isRuleShow) {
      this.w = Keyboard(keyCode.w);
      this.w.press = () => {
        this.changeLionState("jump");
        document.getElementById("keyW").classList.add("press");
        document.getElementById("emuW").classList.add("press");
      };
      this.w.release = () => {
        document.getElementById("keyW").classList.remove("press");
        document.getElementById("emuW").classList.remove("press");
      };
      this.d = Keyboard(keyCode.d);
      this.d.press = () => {
        this.changeLionState("walk");
        document.getElementById("keyD").classList.add("press");
        document.getElementById("emuD").classList.add("press");
      };
      this.d.release = () => {
        this.changeLionState("idle");
        document.getElementById("keyD").classList.remove("press");
        document.getElementById("emuD").classList.remove("press");
      };
    } else {
      if (this.w) {
        this.w.unsubscribe();
        this.d.unsubscribe();
        this.changeLionState("idle");
        document.getElementById("keyD").classList.remove("press");
        document.getElementById("keyW").classList.remove("press");
      }
    }
  }

  initCanvas() {
    this.app = new PIXI.Application({
      width,
      height,
      backgroundColor: 0x000000,
      resolution: ratio,
    });
    document.getElementById("demo-player").appendChild(this.app.view);

    this.player = this.getPlayer();
    this.app.stage.addChild(this.player);
    this.player.position.set(width / 2, height - this.player.height);

    this.app.ticker.add((delta) => {
      if (this.lion.status === "walk") {
        this.playerSpeed(delta);
      } else if (this.lion.status === "jump") {
        this.playerSpeed(delta);
        this.lionSpeedY(delta);
      }
    });
  }

  playerSpeed(delta) {
    const diff_distance = delta * this.lion.speed;
    this.player.x += diff_distance;
    if (this.player.x > width + this.player.width) {
      this.player.x = -this.player.width;
    }
  }

  lionSpeedY(delta) {
    const bottom = height - this.player.height;
    const top = bottom - 50;
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

  changeLionState(state) {
    const _nextStatus = state.split("_")[0];

    switch (true) {
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
      case _nextStatus === "jump":
        this.clown.sprite.textures = clown_on_lion_jump;
        this.lion.sprite.textures = lion_jump;
        break;
    }
    this.lion.status = _nextStatus;
  }

  getPlayer() {
    this.clown.sprite = this.getAnimatedSprite(clown_on_lion_idle);
    this.clown.sprite.position.set(0, 0);
    this.lion.sprite = this.getAnimatedSprite(lion_idle);
    this.lion.sprite.position.set(0, 19);
    let temp = new PIXI.Container();
    temp.addChild(this.clown.sprite);
    temp.addChild(this.lion.sprite);
    return temp;
  }

  getAnimatedSprite(textureArr, options) {
    let temp = new PIXI.AnimatedSprite(textureArr);
    temp.anchor.set(0.5);
    for (let key in options) {
      temp[key].set(options[key]);
    }
    return temp;
  }

  componentWillUnmount() {
    if (this.w) {
      this.w.unsubscribe();
      this.d.unsubscribe();
    }
  }

  render() {
    return (
      <div className="rule-container">
        <div className="info">
          <p>Classic jumping game . Simple but fun .</p>
          <p>Do you want to be a happy clown ?</p>
          <p>Ride on a lion & jump through flaming rings</p>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <div style={{ marginRight: "60px" }}>
            <div className="key-container d-flex align-items-center">
              <div id="keyW" className="button">
                W
              </div>
              <div className="explanation">JUMP</div>
            </div>
            <div className="key-container d-flex align-items-center ">
              <div id="keyD" className="button">
                D
              </div>
              <div className="explanation">FORWARD</div>
            </div>
          </div>
          <div id="demo-player"></div>
        </div>
      </div>
    );
  }
}

export default Rule;
