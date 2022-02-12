export default class System {
  constructor(emu) {
    this.emu = emu;
    this.padData = new Array(4);        
  }

  pollControls(controllers, index) {}

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
};
