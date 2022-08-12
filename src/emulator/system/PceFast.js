import { CIDS } from '@webrcade/app-common';

import System from './System';

// PCE Keys
const PCE_NONE = 0x0000;
const PCE_I = 0x0001;
const PCE_II = 0x0002;
const PCE_SELECT = 0x0004;
const PCE_RUN = 0x0008;
const PCE_RIGHT = 0x0020;
const PCE_LEFT = 0x0080;
const PCE_UP = 0x0010;
const PCE_DOWN = 0x0040;
const PCE_III = 0x0100;
const PCE_IV = 0x0200;
const PCE_V = 0x0400;
const PCE_VI = 0x0800;
// const PCE_I_R   = PCE_I  | BTN_RAPID
// const PCE_II_R  = PCE_II | BTN_RAPID

export default class PceFast extends System {
  constructor(emu) {
    super(emu);

    this.twoButtonMode = !(
      emu.getProps().pad6button && emu.getProps().pad6button === true
    );
  }

  pollControls(controllers, index) {
    let input = PCE_NONE;
    if (controllers.isControlDown(index, CIDS.UP)) {
      input |= PCE_UP;
    }
    if (controllers.isControlDown(index, CIDS.DOWN)) {
      input |= PCE_DOWN;
    }
    if (controllers.isControlDown(index, CIDS.RIGHT)) {
      input |= PCE_RIGHT;
    }
    if (controllers.isControlDown(index, CIDS.LEFT)) {
      input |= PCE_LEFT;
    }
    if (controllers.isControlDown(index, CIDS.A)) {
      input |= PCE_II;
    }
    if (controllers.isControlDown(index, CIDS.B)) {
      input |= PCE_I;
    }
    if (controllers.isControlDown(index, CIDS.SELECT)) {
      input |= PCE_SELECT;
    }
    if (controllers.isControlDown(index, CIDS.START)) {
      input |= PCE_RUN;
    }

    if (this.twoButtonMode) {
      if (controllers.isControlDown(index, CIDS.X)) {
        input |= PCE_I;
      }
      if (controllers.isControlDown(index, CIDS.Y)) {
        input |= PCE_II;
      }
    } else {
      if (controllers.isControlDown(index, CIDS.Y)) {
        input |= PCE_III;
      }
      if (controllers.isControlDown(index, CIDS.X)) {
        input |= PCE_IV;
      }
      if (controllers.isControlDown(index, CIDS.LBUMP)) {
        input |= PCE_V;
      }
      if (controllers.isControlDown(index, CIDS.RBUMP)) {
        input |= PCE_VI;
      }
    }

    this.padData[index] = input;
  }

  getRefreshRate() {
    return 60;
  }

  afterLoad() {
    super.addCanvasClass('pce-sizing');

    // Enable 6 button mode if applicable
    if (!this.twoButtonMode) {
      for (let i = 0; i < 4; i++) {
        this.emu.mednafenModule._emPceSet6PadEnabled(i, 1);
      }
    }
  }

  getFileName() {
    return this.emu.getProps().type === 'mednafen-pce'
      ? 'game.pce'
      : 'game.sgx';
  }

  isSaveStateSupported() {
    return true;
  }
}
