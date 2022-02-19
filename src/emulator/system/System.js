export default class System {
  constructor(emu) {
    this.emu = emu;
    this.padData = new Array(4);        
  }

  pollControls(controllers, index) {}

  beforeLoad() {
  }

  afterLoad() {    
  }

  getFileName() {
    throw Error("Not implemented.");    
  }

  getRefreshRate() {
    throw Error("Not implemented.");
  }

  isVsync() {
    return true;
  }

  addCanvasClass(className) {
    const canvas = this.emu.mednafenModule.canvas;
    if (!canvas) throw Error("Canvas has not been set.");
    canvas.classList.add(className);
  }

  removeCanvasClass(className) {
    const canvas = this.emu.mednafenModule.canvas;
    if (!canvas) throw Error("Canvas has not been set.");
    canvas.classList.remove(className);
  }

  updateInputDeviceData(device) {
    if (device < 4) {
      return this.padData[device];
    }
  }

  isSaveStateSupported() {
    return false;
  }

  getSaveFileName() {
    return "sram.sav";
  }

  getSaveStatePath() {
    const { emu } = this;
    return emu.app.getStoragePath(`${emu.romMd5}/sav`);
  }
};
