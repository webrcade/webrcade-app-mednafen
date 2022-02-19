import {
  CIDS
} from "@webrcade/app-common"

import System from "./System";

// WonderSwan keys
const WS_NONE = 0x0000;
const WS_X1 = 0x0001;
const WS_X2 = 0x0002;
const WS_X3 = 0x0004;
const WS_X4 = 0x0008;
const WS_Y1 = 0x0010;
const WS_Y2 = 0x0020;
const WS_Y3 = 0x0040;
const WS_Y4 = 0x0080;
const WS_START = 0x0100;
const WS_A = 0x0200;
const WS_B = 0x0400;
// #define WS_ROTATE 0x00010000

export default class WSwan extends System {
  constructor(emu) {
    super(emu);
    this.rotated = 
      this.emu.getProps().rotated &&
      this.emu.getProps().rotated === true;
    this.selectDown = false;

    this.langEnglish = true;
    if (emu.getProps().language && emu.getProps().language == 1) {
      this.langEnglish = false;
    }    
  }

  pollControls(controllers, index) {
    let input = WS_NONE;

    if (index === 0) {
      if (!this.rotated) {
        if (controllers.isControlDown(index, CIDS.UP)) {
          input |= WS_X1;
        }
        if (controllers.isControlDown(index, CIDS.DOWN)) {
          input |= WS_X3;
        }
        if (controllers.isControlDown(index, CIDS.RIGHT)) {
          input |= WS_X2;
        }
        if (controllers.isControlDown(index, CIDS.LEFT)) {
          input |= WS_X4;
        }
        if (controllers.isControlDown(index, CIDS.RTRIG)) {
          input |= WS_Y1;
        }
        if (controllers.isControlDown(index, CIDS.LTRIG)) {
          input |= WS_Y3;
        }
        if (controllers.isControlDown(index, CIDS.RBUMP)) {
          input |= WS_Y2;
        }
        if (controllers.isControlDown(index, CIDS.LBUMP)) {
          input |= WS_Y4;
        }
        if (controllers.isControlDown(index, CIDS.A) || controllers.isControlDown(index, CIDS.Y)) {
          input |= WS_B;
        }
        if (controllers.isControlDown(index, CIDS.B) || controllers.isControlDown(index, CIDS.X)) {
          input |= WS_A;
        }
      } else {
        if (controllers.isControlDown(index, CIDS.UP)) {
          input |= WS_Y2;
        }
        if (controllers.isControlDown(index, CIDS.DOWN)) {
          input |= WS_Y4;
        }
        if (controllers.isControlDown(index, CIDS.RIGHT)) {
          input |= WS_Y3;
        }
        if (controllers.isControlDown(index, CIDS.LEFT)) {
          input |= WS_Y1;
        }
        if (controllers.isControlDown(index, CIDS.RTRIG)) {
          input |= WS_Y1;
        }
        if (controllers.isControlDown(index, CIDS.LTRIG)) {
          input |= WS_Y3;
        }
        if (controllers.isControlDown(index, CIDS.X) || 
          controllers.isAxisLeft(index, 1)) {
          input |= WS_X1;
        }
        if (controllers.isControlDown(index, CIDS.Y) ||
          controllers.isAxisUp(index, 1)) {
          input |= WS_X2;
        }
        if (controllers.isControlDown(index, CIDS.A) ||
            controllers.isAxisDown(index, 1)) {
          input |= WS_X4;
        }
        if (controllers.isControlDown(index, CIDS.B) || 
          controllers.isAxisRight(index, 1)) {
          input |= WS_X3;
        }
      }
      if (controllers.isControlDown(index, CIDS.START)) {
        input |= WS_START;
      }
      if (controllers.isControlDown(index, CIDS.SELECT)) {
        this.selectDown = true;
      } else {
        if (this.selectDown) {
          this.rotated = !this.rotated;
          this.updateCanvasClass();
          this.selectDown = false;
        }
      }
    }
    this.padData[index] = input;
  }

  getRefreshRate() {
    return 75.5;
  }

  isVsync() {
    return false;
  }

  updateCanvasClass() {
    if (this.rotated) {
      super.removeCanvasClass("ws-rotate0");
      super.addCanvasClass("ws-rotate270");
    } else {
      super.removeCanvasClass("ws-rotate270");
      super.addCanvasClass("ws-rotate0");
    }
  }

  beforeLoad() {
    this.emu.mednafenModule._Wswan_SetLanguage(this.langEnglish ?  1 : 0);
  }

  afterLoad() {
    this.updateCanvasClass();
  }

  getFileName() {
    return "game.wsc";
  }

  isSaveStateSupported() {
    return true;
  }
};

