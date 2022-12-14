import { CIDS } from '@webrcade/app-common';

import System from './System';

// Virtual boy keys
const VB_NONE = 0x0000;
const VB_KEY_A = 0x0001;
const VB_KEY_B = 0x0002;
const VB_KEY_R = 0x0004;
const VB_KEY_L = 0x0008;
const VB_R_UP = 0x0010;
const VB_R_RIGHT = 0x0020;
const VB_L_RIGHT = 0x0040;
const VB_L_LEFT = 0x0080;
const VB_L_DOWN = 0x0100;
const VB_L_UP = 0x0200;
const VB_KEY_START = 0x0400;
const VB_KEY_SELECT = 0x0800;
const VB_R_LEFT = 0x1000;
const VB_R_DOWN = 0x2000;

export default class Vb extends System {
  pollControls(controllers, index) {
    let input = VB_NONE;

    if (index === 0) {
      if (controllers.isControlDown(index, CIDS.UP)) {
        input |= VB_L_UP;
      }
      if (controllers.isControlDown(index, CIDS.DOWN)) {
        input |= VB_L_DOWN;
      }
      if (controllers.isControlDown(index, CIDS.RIGHT)) {
        input |= VB_L_RIGHT;
      }
      if (controllers.isControlDown(index, CIDS.LEFT)) {
        input |= VB_L_LEFT;
      }
      if (
        controllers.isControlDown(index, CIDS.A) ||
        controllers.isControlDown(index, CIDS.Y)
      ) {
        input |= VB_KEY_B;
      }
      if (
        controllers.isControlDown(index, CIDS.B) ||
        controllers.isControlDown(index, CIDS.X)
      ) {
        input |= VB_KEY_A;
      }
      if (controllers.isControlDown(index, CIDS.SELECT)) {
        input |= VB_KEY_SELECT;
      }
      if (controllers.isControlDown(index, CIDS.START)) {
        input |= VB_KEY_START;
      }
      if (controllers.isControlDown(index, CIDS.LBUMP)) {
        input |= VB_KEY_L;
      }
      if (controllers.isControlDown(index, CIDS.RBUMP)) {
        input |= VB_KEY_R;
      }
      if (controllers.isAxisLeft(index, 1)) {
        input |= VB_R_LEFT;
      }
      if (controllers.isAxisRight(index, 1)) {
        input |= VB_R_RIGHT;
      }
      if (controllers.isAxisUp(index, 1)) {
        input |= VB_R_UP;
      }
      if (controllers.isAxisDown(index, 1)) {
        input |= VB_R_DOWN;
      }
    }
    this.padData[index] = input;
  }

  getShotAspectRatio() { return 1.714; }

  getRefreshRate() {
    return 50.3;
  }

  isVsync() {
    return true;
  }

  afterLoad() {
    super.addCanvasClass('vb-sizing');
  }

  getFileName() {
    return 'game.vb';
  }

  isSaveStateSupported() {
    return true;
  }
}
