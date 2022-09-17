import { FetchAppData, Unzip, CIDS } from '@webrcade/app-common';

import System from './System';

// Lynx keys
const LYNX_NONE = 0x0000;
const LYNX_A = 0x0001;
const LYNX_B = 0x0002;
const LYNX_OPT2 = 0x0004;
const LYNX_OPT1 = 0x0008;
const LYNX_LEFT = 0x0010;
const LYNX_RIGHT = 0x0020;
const LYNX_UP = 0x0040;
const LYNX_DOWN = 0x0080;
const LYNX_PAUSE = 0x0100;

export default class Lynx extends System {
  constructor(emu) {
    super(emu);
    this.refreshRate = 75;
    this.rotation = 0;
    if (this.emu.getProps().rotation) {
      this.rotation = parseInt(this.emu.getProps().rotation);
    }
    this.bootRom = this.emu.getProps().lnx_boot;
    if (!this.bootRom) {
      throw new Error(
        'A Lynx Boot ROM was not specified, refer to documentation:\n' +
          '(https://docs.webrcade.com/apps/emulators/lynx/)',
      );
    }
  }

  pollControls(controllers, index) {
    let input = LYNX_NONE;

    let left = LYNX_LEFT;
    let up = LYNX_UP;
    let right = LYNX_RIGHT;
    let down = LYNX_DOWN;

    if (index === 0) {
      switch (this.rotation) {
        case 90:
          up = LYNX_LEFT;
          left = LYNX_DOWN;
          down = LYNX_RIGHT;
          right = LYNX_UP;
          break;
        case 270:
          up = LYNX_RIGHT;
          left = LYNX_UP;
          down = LYNX_LEFT;
          right = LYNX_DOWN;
          break;
        default:
          break;
      }
      if (controllers.isControlDown(index, CIDS.UP)) {
        input |= up;
      }
      if (controllers.isControlDown(index, CIDS.DOWN)) {
        input |= down;
      }
      if (controllers.isControlDown(index, CIDS.RIGHT)) {
        input |= right;
      }
      if (controllers.isControlDown(index, CIDS.LEFT)) {
        input |= left;
      }
      if (controllers.isControlDown(index, CIDS.RBUMP)) {
        input |= LYNX_OPT2;
      }
      if (controllers.isControlDown(index, CIDS.LBUMP)) {
        input |= LYNX_OPT1;
      }
      if (
        controllers.isControlDown(index, CIDS.A) ||
        controllers.isControlDown(index, CIDS.Y)
      ) {
        input |= LYNX_B;
      }
      if (
        controllers.isControlDown(index, CIDS.B) ||
        controllers.isControlDown(index, CIDS.X)
      ) {
        input |= LYNX_A;
      }
      if (controllers.isControlDown(index, CIDS.START)) {
        input |= LYNX_PAUSE;
      }
    }
    this.padData[index] = input;
  }

  getRefreshRate() {
    return this.refreshRate;
  }

  setRefreshRate(rate) {
    this.refreshRate = rate;
  }

  isVsync() {
    return false;
  }

  async beforeLoad() {
    try {
      const FS = this.emu.mednafenModule.FS;
      // Unzip utility
      const uz = new Unzip().setDebug(true);
      // Fetch the image
      const res = await new FetchAppData(this.bootRom).fetch();
      let blob = await res.blob();
      // Unzip it
      blob = await uz.unzip(blob, ['.bin', '.img']);
      // Convert to array buffer
      const arrayBuffer = await new Response(blob).arrayBuffer();
      // Write to file system
      const u8array = new Uint8Array(arrayBuffer);
      FS.writeFile('lynxboot.img', u8array);
    } catch (e) {
      throw new Error('Error loading Lynx boot ROM: ' + e);
    }
  }

  afterLoad() {
    super.addCanvasClass('lynx-rotate' + this.rotation);
  }

  getFileName() {
    return 'game.lnx';
  }

  isSaveStateSupported() {
    return false;
  }
}
