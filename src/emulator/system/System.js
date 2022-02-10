export default class System {
  constructor(emu) {
    this.emu = emu;
    this.padData = new Array(4);    
  }

  pollControls(controllers, index) {}

  afterLoad() {}

  getFileName() {
    throw "Not implemented.";    
  }

  updateInputDeviceData(device) {
    if (device < 4) {
      return this.padData[device];
    }
  }
};
