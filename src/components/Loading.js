import * as React from "react";
import { browserHistory } from "react-router";
import * as PIXI from "pixi.js";
window.PIXI = PIXI;
require("pixi-layers");
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
import {
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
} from "../config.js";

let { width, height } = getSize();

class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    PIXI.utils.clearTextureCache();
    this.initCanvas();
  }

  initCanvas() {
    let dom = document.getElementById("pixi-container");

    gsap.registerPlugin(PixiPlugin);
    PixiPlugin.registerPIXI(PIXI);
    this.app = new PIXI.Application(canvas);
    dom.appendChild(this.app.view);
    this.timeline1 = gsap.timeline();

    dom.style.transform = `scale(${getScale()})`;
    window.onresize = () => {
      dom.style.transform = `scale(${getScale()})`;
    };

    this.loading();
  }

  loading() {
    this.loadingText = this.addText(
      "L o a d i n g . . .",
      this.getLoadingTextPos(),
      loadingTextStyle
    );
    this.progressText = this.addText(
      "0 %",
      this.getProgressTextPos(),
      loadingTextStyle
    );

    this.app.loader
      .add([bar, bar_bg, logo, stage1_bg, stage2_bg, stars])
      .on("progress", (loader) => {
        this.progressText.text = parseInt(loader.progress * 100) / 100 + "%";
      })
      .load((loader, resCache) => {
        this.loadComplete();
      });
  }

  loadComplete() {
    this.props.data.appChange(this.app);
    this.loadingText.destroy(true);
    this.progressText.destroy(true);
    browserHistory.push("game");
  }

  getLoadingTextPos() {
    return { x: width / 2, y: height / 2 - height / 30 };
  }

  getProgressTextPos() {
    return { x: width / 2, y: height / 2 + height / 15 };
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

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  componentWillUnmount() {
    // window.onresize = null;
  }

  render() {
    let children = this.props.children;
    return <div>{children}</div>;
  }
}

export default Loading;
