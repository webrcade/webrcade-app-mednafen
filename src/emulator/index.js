import {
  AppWrapper,
  Controller, 
  Controllers, 
  DefaultKeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  CIDS,
  LOG  
} from "@webrcade/app-common"

window.audioCallback = null;

export class Emulator extends AppWrapper {
  constructor(app, debug = false) {
    super(app, debug);

    this.mednafenModule = null;
    this.romBytes = null;
    this.romMd5 = null;
    this.romName = null;
    this.saveStatePath = null;
    this.started = false;
    this.escapeCount = -1;
  }

  async setRom(name, bytes, md5) {
    return new Promise((resolve, reject) => {    
      if (bytes.byteLength === 0) {
        throw new Error("The size is invalid (0 bytes).");
      }
      this.romName = name;
      this.romMd5 = md5;
      this.romBytes = bytes;

      LOG.info('name: ' + this.romName);
      LOG.info('md5: ' + this.romMd5);

      resolve();
    });
  }  

  createControllers() {
    return new Controllers([
      new Controller(new DefaultKeyCodeToControlMapping()),
      new Controller(),
      new Controller(),
      new Controller()
    ]);
  }  

  createAudioProcessor() {
    return new ScriptAudioProcessor(2, 48000).setDebug(this.debug);
  }

  async onShowPauseMenu() {
    await this.saveState();
  }

  pollControls() {
    const { controllers } = this;
    
    controllers.poll();

    for (let i = 0; i < 4; i++) {

      if (controllers.isControlDown(i, CIDS.ESCAPE)) {
        if (this.pause(true)) {
          controllers.waitUntilControlReleased(i, CIDS.ESCAPE)
            .then(() => this.showPauseMenu());
          return;
        }
      }

      // this.mednafenModule._updateControls(i, input, axisX, axisY);
    }
  }
                             
  loadEmscriptenModule() {
    const { app } = this;

    return new Promise((resolve, reject) => {

      const script = document.createElement('script');
      document.body.appendChild(script);

      script.src = 'js/mednafen.js';
      script.async = false;      
      script.onerror = () => {
        reject("An error occurred attempting to load the mednafen engine.");
      }
      script.onload = () => {
        LOG.info('Script loaded.');
        if (window.mednafen) {
          window.mednafen()
            .then(mednafenModule => {
              console.log(mednafenModule);
              mednafenModule.onAbort = msg => app.exit(msg);
              mednafenModule.onExit = () => app.exit();  
              this.mednafenModule = mednafenModule;
              resolve();
            });
        } else {
          reject("An error occurred attempting to load the mednafen engine.");
        }
      };
    });
  }

  async destroy() {
    console.log('destroy start')
    if (this.audioProcessor) {
      this.audioProcessor.pause(true);
    }
    console.log('destroy end')
  }

  async loadState() {
    return;    
  }


  async saveState() {
    return;
  }

  async onStart(canvas) {
    const { app, debug, mednafenModule, romBytes } = this;

    try {
      // FS
      const FS = mednafenModule.FS;      

      // Set the canvas for the module
      mednafenModule.canvas = canvas; 
                
      // Load save state
      await this.loadState();

      // Initialize the module
      mednafenModule._emInit();

      // Load the ROM
      const filename = "game.pce";
      const u8array = new Uint8Array(romBytes);
      FS.writeFile(filename, u8array);
      const loadMethod = mednafenModule.cwrap('LoadGame', 'number', ['string', 'string']);
      loadMethod(null, filename);

      // Create display loop
      this.displayLoop = new DisplayLoop(60, false, debug);

      // Start the audio processor
      this.audioProcessor.start();      

      // Mark that the loop is starting
      this.started = true;

      let audioArray = null;
      window.audioCallback = (offset, length) => {        
        audioArray = new Int16Array(mednafenModule.HEAP16.buffer, offset, 4096);
        this.audioProcessor.storeSoundCombinedInput(audioArray, 2, length, 0, 32768);
      }

      // Start the display loop    
      this.displayLoop.start(() => {        
        try {
          mednafenModule._emStep();
          this.pollControls();
          
        } catch (e) {
          app.exit(e);
        }
      });
    } catch(e) {
      LOG.error(e);
      app.exit(e);
    }
  }
}
