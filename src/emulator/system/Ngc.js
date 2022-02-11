import {
  CIDS
} from "@webrcade/app-common"

import System from "./System";

// NeoGeoPocket keys
const NGP_NONE = 0x0000;
const NGP_UP = 0x0001;
const NGP_DOWN = 0x0002;
const NGP_LEFT = 0x0004;
const NGP_RIGHT = 0x0008;
const NGP_A = 0x0010;
const NGP_B = 0x0020;
const NGP_OPTION = 0x0040;

export default class Ngc extends System {

  pollControls(controllers, index) {
    let input = NGP_NONE;

    if (index === 0) {
      if (controllers.isControlDown(index, CIDS.UP)) {
        input |= NGP_UP;
      }
      if (controllers.isControlDown(index, CIDS.DOWN)) {
        input |= NGP_DOWN;
      }
      if (controllers.isControlDown(index, CIDS.RIGHT)) {
        input |= NGP_RIGHT;
      }
      if (controllers.isControlDown(index, CIDS.LEFT)) {
        input |= NGP_LEFT;
      }
      if (controllers.isControlDown(index, CIDS.A) || controllers.isControlDown(index, CIDS.Y)) {
        input |= NGP_A;
      }
      if (controllers.isControlDown(index, CIDS.B) || controllers.isControlDown(index, CIDS.X)) {
        input |= NGP_B;
      }
      if (controllers.isControlDown(index, CIDS.START)) {
        input |= NGP_OPTION;
      }
    }
    this.padData[index] = input;
  }

  getRefreshRate() {
    return 60;
  }

  afterLoad() {
    super.addCanvasClass("ngc-sizing");
  }

  getFileName() {
    return "game.ngc";
  }
};

