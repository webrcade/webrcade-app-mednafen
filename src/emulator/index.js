import {
  AppWrapper,
  Controller,
  Controllers,
  DefaultKeyCodeToControlMapping,
  DisplayLoop,
  ScriptAudioProcessor,
  CIDS,
  LOG,
} from '@webrcade/app-common';

import Lynx from './system/Lynx';
import Ngc from './system/Ngc';
import PceFast from './system/PceFast';
import Vb from './system/Vb';
import WSwan from './system/WSwan';

window.audioCallback = null;

const STATE_FILE_PATH = "/state";

export class Emulator extends AppWrapper {
  constructor(app, debug = false) {
    super(app, debug);

    this.mednafenModule = null;
    this.romBytes = null;
    this.romMd5 = null;
    this.romName = null;
    this.started = false;
    this.escapeCount = -1;

    const type = this.getProps().type;
    console.log('Type: ' + type);
    if (type === 'mednafen-pce' || type === 'mednafen-sgx') {
      this.system = new PceFast(this);
    } else if (type === 'mednafen-vb') {
      this.system = new Vb(this);
    } else if (type === 'mednafen-ngc' || type === 'mednafen-ngp') {
      this.system = new Ngc(this);
    } else if (type === 'mednafen-wsc' || type === 'mednafen-ws') {
      this.system = new WSwan(this);
    } else if (type === 'mednafen-lnx') {
      this.system = new Lynx(this);
    } else {
      throw Error('Unknown system: ' + type);
    }
    window.system = this.system;
  }

  SAVE_NAME = 'sav';

  async setRom(name, bytes, md5) {
    return new Promise((resolve, reject) => {
      if (bytes.byteLength === 0) {
        throw new Error('The size is invalid (0 bytes).');
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
      new Controller(),
    ]);
  }

  createAudioProcessor() {
    return new ScriptAudioProcessor(2, 48000).setDebug(this.debug);
  }

  async onShowPauseMenu() {
    await this.saveState();
  }

  pollControls() {
    const { controllers, system } = this;

    controllers.poll();

    for (let i = 0; i < 4; i++) {
      if (controllers.isControlDown(i, CIDS.ESCAPE)) {
        if (this.pause(true)) {
          controllers
            .waitUntilControlReleased(i, CIDS.ESCAPE)
            .then(() => this.showPauseMenu());
          return;
        }
      }

      system.pollControls(controllers, i);
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
        reject('An error occurred attempting to load the mednafen engine.');
      };
      script.onload = () => {
        LOG.info('Script loaded.');
        if (window.mednafen) {
          window.mednafen().then((mednafenModule) => {
            console.log(mednafenModule);
            mednafenModule.onAbort = (msg) => app.exit(msg);
            mednafenModule.onExit = () => app.exit();
            this.mednafenModule = mednafenModule;
            resolve();
          });
        } else {
          reject('An error occurred attempting to load the mednafen engine.');
        }
      };
    });
  }

  async destroy() {
    console.log('destroy start');
    if (this.audioProcessor) {
      this.audioProcessor.pause(true);
    }
    console.log('destroy end');
  }

  getDefaultAspectRatio() {
    const { system } = this;
    const ar = system.getShotAspectRatio();
    return ar;
  }

  isScreenRotated() {
    const { system } = this;
    let rot = system.getShotRotation();
    if (rot) rot = parseInt(rot);
    const rotated = ( rot === 90 || rot === 270 );
    return rotated;
  }

  async migrateSaves() {
    const { storage, system, SAVE_NAME } = this;

    const saveStatePath = system.getSaveStatePath();

    // Load old saves (if applicable)
    const sram = await storage.get(saveStatePath);
    if (sram) {
      LOG.info('Migrating local saves.');

      await this.getSaveManager().saveLocal(saveStatePath, [
        {
          name: SAVE_NAME,
          content: sram,
        },
      ]);

      // Delete old location (and info)
      await storage.remove(saveStatePath);
      await storage.remove(`${saveStatePath}/info`);
    }
  }

  async loadState() {
    const { mednafenModule, system, SAVE_NAME } = this;
    const { FS } = mednafenModule;

    if (!system.isSaveStateSupported()) {
      // Check cloud storage (Lynx, to eliminate delay when showing settings)
      try {
        await this.getSaveManager().isCloudEnabled(this.loadMessageCallback);
      } finally {
        this.loadMessageCallback(null);
      }

      return;
    }

    try {
      // Migrate old save format
      await this.migrateSaves();

      const saveFile = system.getSaveFileName();
      const saveStatePath = system.getSaveStatePath();

      // Write the save state (if applicable)
      // Create the save path (MEM FS)
      const res = FS.analyzePath(saveFile, true);
      if (!res.exists) {
        // Load from new save format
        const files = await this.getSaveManager().load(
          saveStatePath,
          this.loadMessageCallback,
        );

        if (files) {
          for (let i = 0; i < files.length; i++) {
            const f = files[i];
            if (f.name === SAVE_NAME) {
              LOG.info('writing sram file: ' + saveStatePath);
              FS.writeFile(saveFile, f.content);
              break;
            }
          }

          // Cache the initial files
          await this.getSaveManager().checkFilesChanged(files);
        }
      }
    } catch (e) {
      LOG.error(e);
    }
  }

  async saveInOldFormat(s) {
    const { system } = this;
    const saveStatePath = system.getSaveStatePath();

    // old, for testing migration
    await this.saveStateToStorage(saveStatePath, s);
  }

  async saveState() {
    const { mednafenModule, started, system, SAVE_NAME } = this;
    const { FS } = mednafenModule;

    if (!started || !system.isSaveStateSupported()) {
      return;
    }

    try {
      const saveFile = system.getSaveFileName();
      const saveStatePath = system.getSaveStatePath();

      if (saveFile && saveStatePath && mednafenModule._emSramSave()) {
        const res = FS.analyzePath(saveFile, true);
        if (res.exists) {
          const s = FS.readFile(saveFile);
          if (s) {
            // await this.saveInOldFormat(s);
            const files = [
              {
                name: SAVE_NAME,
                content: s,
              },
            ];

            if (await this.getSaveManager().checkFilesChanged(files)) {
              LOG.info('saving to: ' + saveStatePath);
              await this.getSaveManager().save(
                saveStatePath,
                files,
                this.saveMessageCallback,
              );
            }
          }
        }
      }
    } catch (e) {
      LOG.error('Error persisting save state: ' + e);
    }
  }

  async getStateSlots(showStatus = true) {
    const { system } = this;
    return await this.getSaveManager().getStateSlots(
      system.getSaveStatePrefix(), showStatus ? this.saveMessageCallback : null
    );
  }

  async saveStateForSlot(slot) {
    const { mednafenModule, system } = this;

    mednafenModule._emSaveState();

    let s = null;
    try {

      const FS = mednafenModule.FS;
      try {
        s = FS.readFile(STATE_FILE_PATH);
      } catch (e) {}

      if (s) {
        const props = {}

        const ar = system.getShotAspectRatio();
        if (ar) {
          props.aspectRatio = `${ar}`;
        }
        const rot = system.getShotRotation();
        if (rot) {
          props.transform = `rotate(${rot}deg)`;
        }

        await this.getSaveManager().saveState(
          system.getSaveStatePrefix(), slot, s,
          this.canvas,
          this.saveMessageCallback,
          null,
          props);
      }
    } catch (e) {
      LOG.error('Error saving state: ' + e);
    }

    return true;
  }

  async loadStateForSlot(slot) {
    const { mednafenModule, system } = this;

    try {
      const state = await this.getSaveManager().loadState(
        system.getSaveStatePrefix(), slot, this.saveMessageCallback);

      if (state) {
        const FS = mednafenModule.FS;
        FS.writeFile(STATE_FILE_PATH, state);
        mednafenModule._emLoadState();
      }
    } catch (e) {
      LOG.error('Error loading state: ' + e);
    }
    return true;
  }

  async deleteStateForSlot(slot, showStatus = true) {
    const { system } = this;
    try {
      await this.getSaveManager().deleteState(
        system.getSaveStatePrefix(), slot, showStatus ? this.saveMessageCallback : null);
    } catch (e) {
      LOG.error('Error deleting state: ' + e);
    }
    return true;
  }

  async onStart(canvas) {
    const { app, debug, mednafenModule, romBytes, system } = this;

    try {
      // FS
      const FS = mednafenModule.FS;

      // Set the canvas for the module
      mednafenModule.canvas = canvas;
      this.canvas = canvas;

      // Load save state
      await this.loadState();


      // Initialize the module
      mednafenModule._emInit();

      // Notify before the load
      await system.beforeLoad();

      // Load the ROM
      const filename = system.getFileName();
      const u8array = new Uint8Array(romBytes);
      FS.writeFile(filename, u8array);
      const loadMethod = mednafenModule.cwrap('LoadGame', 'number', [
        'string',
        'string',
      ]);
      loadMethod(null, filename);

      // Notify the system that the ROM was loaded
      system.afterLoad();

      // Create display loop
      let refreshRate = system.getRefreshRate();
      this.displayLoop = new DisplayLoop(refreshRate, system.isVsync(), debug);

      // Start the audio processor
      this.audioProcessor.start();

      // Enable showing messages
      this.setShowMessageEnabled(true);

      // Mark that the loop is starting
      this.started = true;

      let audioArray = null;
      window.audioCallback = (offset, length) => {
        audioArray = new Int16Array(mednafenModule.HEAP16.buffer, offset, 4096);
        this.audioProcessor.storeSoundCombinedInput(
          audioArray,
          2,
          length,
          0,
          32768,
        );
      };

      // Start the display loop
      let count = 0;
      this.displayLoop.start(() => {
        try {
          this.pollControls();
          mednafenModule._emStep();
          if (count < 10) {
            this.updateScreenSize();
            count++;
          }
          const refresh = system.getRefreshRate();
          if (refresh !== refreshRate) {
            refreshRate = refresh;
            return refreshRate;
          }
          return 0;
        } catch (e) {
          app.exit(e);
        }
      });
    } catch (e) {
      LOG.error(e);
      if (e.status && e.status === 1212) {
        app.exit('Unknown file format.');
      } else {
        app.exit(e);
      }
    }
  }
}
