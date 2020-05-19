import * as PIXI from "pixi.js";

import bar from "./assets/images/progress_bar.png";
import bar_bg from "./assets/images/progress_bar_bg.png";
import logo from "./assets/images/logo.png";
import spriteSheet from "./assets/images/spritesheet.gif";
import stage1_bg from "./assets/images/stage1.png";
import stage2_bg from "./assets/images/stage2.png";
import stars from "./assets/images/stars.png";
import audio_stage1 from "./assets/audio/stage1.mp3";
import audio_rip from "./assets/audio/rip.mp3";
import audio_win from "./assets/audio/applause.mp3";

const canvasWidth = 680;
const ratio = 2;

function getSize() {
  const width = canvasWidth / ratio;
  const height = (width / 4) * 3;
  return { width, height };
}

function getScale() {
  const scale =
    window.innerWidth > canvasWidth ? 1 : window.innerWidth / canvasWidth;
  return scale;
}

const canvas = {
  ...getSize(),
  backgroundColor: 0x000000,
  resolution: ratio
};

const loadingTextStyle = new PIXI.TextStyle({
  fontSize: 13,
  fontStyle: "italic",
  fill: ["#ffffff", "#00ff99"], // gradient
  stroke: "#4a1850",
  strokeThickness: 1
});

const startTextStyle = new PIXI.TextStyle({
  fontSize: 13,
  fill: "#ffffff", // gradient
  stroke: "#4a1850",
  strokeThickness: 1
});

const labelStyle = new PIXI.TextStyle({
  fontSize: 8,
  fill: "#ffffff", // gradient
  stroke: "#4a1850",
  strokeThickness: 1
});

const keyCode = {
  enter: 13,
  right: 39,
  left: 37,
  up: 38,
  space: 32,
  w: 87,
  a: 65,
  d: 68,
  m: 77
};

const sheet = new PIXI.BaseTexture(spriteSheet);

const clown_move = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(159, 5, 24, 24)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(180, 5, 24, 24)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(200, 5, 24, 24))
];

const clown_die = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(162, 31, 21, 25))
];

const clown_win = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(201, 57, 18, 26)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(219, 57, 18, 26))
];

const clown_on_lion_walk = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(180, 58, 19, 24)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(162, 58, 19, 24))
];
const clown_on_lion_idle = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(162, 58, 19, 24))
];
const clown_on_lion_jump = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(180, 58, 19, 24))
];

const lion_jump = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(164, 86, 34, 18))
];
const lion_walk = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(197, 86, 34, 18)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(164, 86, 34, 18))
];
const lion_idle = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(232, 86, 34, 18))
];
const lion_die = [new PIXI.Texture(sheet, new PIXI.Rectangle(270, 86, 34, 18))];

const fireHoopLL = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(137, 144, 12, 82)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(165, 144, 12, 82))
];
const fireHoopLR = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(149, 144, 12, 82)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(177, 144, 12, 82))
];

const firePit = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(194, 193, 25, 42)),
  new PIXI.Texture(sheet, new PIXI.Rectangle(220, 193, 25, 42))
];

const destination = [
  new PIXI.Texture(sheet, new PIXI.Rectangle(89, 234, 40, 32))
];

export {
  getSize,
  getScale,
  canvas,
  bar,
  bar_bg,
  logo,
  stage1_bg,
  stage2_bg,
  stars,
  loadingTextStyle,
  startTextStyle,
  labelStyle,
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
  destination,
  fireHoopLL,
  fireHoopLR,
  firePit,
  audio_stage1,
  audio_rip,
  audio_win
};
