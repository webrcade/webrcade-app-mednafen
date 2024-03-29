import {
  romNameScorer,
  setMessageAnchorId,
  settings,
  AppRegistry,
  FetchAppData,
  Resources,
  Unzip,
  UrlUtil,
  WebrcadeApp,
  APP_TYPE_KEYS,
  LOG,
  TEXT_IDS,
} from '@webrcade/app-common';
import { Emulator } from './emulator';
import { EmulatorPauseScreen } from './pause';

import './App.scss';

class App extends WebrcadeApp {
  emulator = null;

  componentDidMount() {
    super.componentDidMount();

    setMessageAnchorId('canvas');

    const { appProps, ModeEnum } = this;

    const exts = [
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_PCE,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_SGX,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_VB,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_LNX,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_NGC,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_NGP,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_WSC,
        true,
        false,
      ),
      ...AppRegistry.instance.getExtensions(
        APP_TYPE_KEYS.MEDNAFEN_WS,
        true,
        false,
      ),
    ];
    const extsNotUnique = [
      ...new Set([
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_PCE,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_SGX,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_VB,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_LNX,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_NGC,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_NGP,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_WSC,
          true,
          true,
        ),
        ...AppRegistry.instance.getExtensions(
          APP_TYPE_KEYS.MEDNAFEN_WS,
          true,
          true,
        ),
      ]),
    ];

    try {
      // Get the ROM location that was specified
      const rom = appProps.rom;
      if (!rom) throw new Error('A ROM file was not specified.');

      // Create the emulator
      if (this.emulator === null) {
        this.emulator = new Emulator(this, this.isDebug());
      }
      const emulator = this.emulator;

      // Load emscripten and the ROM
      const uz = new Unzip().setDebug(this.isDebug());
      let romBlob = null;
      let romMd5 = null;
      emulator
        .loadEmscriptenModule()
        .then(() => settings.load())
        // .then(() => settings.setBilinearFilterEnabled(true))
        // .then(() => settings.setVsyncEnabled(false))
        .then(() => new FetchAppData(rom).fetch())
        .then((response) => {
          LOG.info('downloaded.');
          return response.blob();
        })
        .then((blob) => uz.unzip(blob, extsNotUnique, exts, romNameScorer))
        .then((blob) => {
          romBlob = blob;
          return blob;
        })
        .then((blob) => AppRegistry.instance.getMd5(blob, this.getAppType()))
        .then((md5) => {
          romMd5 = md5;
        })
        .then(() => new Response(romBlob).arrayBuffer())
        .then((bytes) =>
          emulator.setRom(
            uz.getName() ? uz.getName() : UrlUtil.getFileName(rom),
            bytes,
            romMd5,
          ),
        )
        .then(() => this.setState({ mode: ModeEnum.LOADED }))
        .catch((msg) => {
          LOG.error(msg);
          this.exit(
            this.isDebug()
              ? msg
              : Resources.getText(TEXT_IDS.ERROR_RETRIEVING_GAME),
          );
        });
    } catch (e) {
      this.exit(e);
    }
  }

  async onPreExit() {
    try {
      await super.onPreExit();
      if (this.emulator) {
        if (!this.isExitFromPause()) {
          await this.emulator.saveState();
        }
        await this.emulator.destroy();
      }
    } catch (e) {
      LOG.error(e);
    }
  }

  componentDidUpdate() {
    const { mode } = this.state;
    const { canvas, emulator, ModeEnum } = this;

    if (mode === ModeEnum.LOADED) {
      window.focus();
      // Start the emulator
      emulator.start(canvas);
    }
  }

  renderPauseScreen() {
    const { appProps, emulator } = this;

    return (
      <EmulatorPauseScreen
        type={this.getAppType()}
        emulator={emulator}
        appProps={appProps}
        closeCallback={() => this.resume()}
        exitCallback={() => this.exitFromPause()}
        isEditor={this.isEditor}
        isStandalone={this.isStandalone}
      />
    );
  }

  renderCanvas() {
    return (
      <canvas
        style={this.getCanvasStyles()}
        ref={(canvas) => {
          this.canvas = canvas;
        }}
        id="canvas"
      ></canvas>
    );
  }

  render() {
    const { mode } = this.state;
    const { ModeEnum } = this;

    return (
      <>
        {super.render()}
        {mode === ModeEnum.LOADING ? this.renderLoading() : null}
        {mode === ModeEnum.PAUSE ? this.renderPauseScreen() : null}
        {mode === ModeEnum.LOADED || mode === ModeEnum.PAUSE
          ? this.renderCanvas()
          : null}
      </>
    );
  }
}

export default App;
