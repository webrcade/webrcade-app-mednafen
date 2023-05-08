import React from 'react';
import { Component } from 'react';

import {
  LynxGamepadControls,
  LynxKeyboardControls,
  NgpGamepadControls,
  NgpKeyboardControls,
  Pce2GamepadControls,
  Pce6GamepadControls,
  Pce2KeyboardControls,
  Pce6KeyboardControls,
  WonderSwanGamepadControls,
  WonderSwanGamepadControlsRotated,
  WonderSwanKeyboardControls,
  WonderSwanKeyboardControlsRotated,
} from './controls';

import {
  AppSettingsEditor,
  CustomPauseScreen,
  EditorScreen,
  PceBackground,
  SgxBackground,
  NgpBackground,
  NgcBackground,
  LynxBackground,
  WscBackground,
  WsBackground,
  VbBackground,
  GamepadWhiteImage,
  KeyboardWhiteImage,
  PauseScreenButton,
  Resources,
  SaveStatesEditor,
  SaveWhiteImage,
  SettingsAppWhiteImage,
  TEXT_IDS,
} from '@webrcade/app-common';

export class EmulatorPauseScreen extends Component {
  constructor() {
    super();
    this.state = {
      mode: this.ModeEnum.PAUSE,
      cloudEnabled: false,
      loaded: false
    };
  }

  ModeEnum = {
    PAUSE: 'pause',
    CONTROLS: 'controls',
    SETTINGS: 'settings',
    STATE: 'state',
  };

  ADDITIONAL_BUTTON_REFS = [React.createRef(), React.createRef(), React.createRef()];

  componentDidMount() {
    const { loaded } = this.state;
    const { emulator } = this.props;

    if (!loaded) {
      let cloudEnabled = false;
      emulator.getSaveManager().isCloudEnabled()
        .then(c => { cloudEnabled = c; })
        .finally(() => {
          this.setState({
            loaded: true,
            cloudEnabled: cloudEnabled
          });
        })
    }
  }

  render() {
    const { ADDITIONAL_BUTTON_REFS, ModeEnum } = this;
    const { appProps, closeCallback, emulator, exitCallback, isEditor, isStandalone, type } =
      this.props;
    const { cloudEnabled, loaded, mode } = this.state;

    if (!loaded) {
      return null;
    }

    const additionalButtons = [
      <PauseScreenButton
        imgSrc={GamepadWhiteImage}
        buttonRef={ADDITIONAL_BUTTON_REFS[0]}
        label={Resources.getText(TEXT_IDS.VIEW_CONTROLS)}
        onHandlePad={(focusGrid, e) =>
          focusGrid.moveFocus(e.type, ADDITIONAL_BUTTON_REFS[0])
        }
        onClick={() => {
          this.setState({ mode: ModeEnum.CONTROLS });
        }}
      />,
      <PauseScreenButton
        imgSrc={SettingsAppWhiteImage}
        buttonRef={ADDITIONAL_BUTTON_REFS[1]}
        label={
              type === 'mednafen-pce' ? "PC Engine Settings" :
                type === 'mednafen-sgx' ? "SuperGrafx Settings" :
                  type === 'mednafen-ngp' ? "NG Pocket Settings" :
                    type === 'mednafen-lnx' ? "Lynx Settings" :
                      type === 'mednafen-ws' ? "WonderSwan Settings" :
                        type === 'mednafen-wsc' ? "WS Color Settings" :
                          type === 'mednafen-ngc' ? "NGP Color Settings": "Virtual Boy Settings"}
        onHandlePad={(focusGrid, e) =>
          focusGrid.moveFocus(e.type, ADDITIONAL_BUTTON_REFS[1])
        }
        onClick={() => {
          this.setState({ mode: ModeEnum.SETTINGS });
        }}
      />,
    ];

    if (cloudEnabled) {
      additionalButtons.push(
        <PauseScreenButton
          imgSrc={SaveWhiteImage}
          buttonRef={ADDITIONAL_BUTTON_REFS[2]}
          label={Resources.getText(TEXT_IDS.SAVE_STATES)}
          onHandlePad={(focusGrid, e) =>
            focusGrid.moveFocus(e.type, ADDITIONAL_BUTTON_REFS[2])
          }
          onClick={() => {
            this.setState({ mode: ModeEnum.STATE });
          }}
        />
      );
    }

    return (
      <>
        {mode === ModeEnum.PAUSE ? (
          <CustomPauseScreen
            appProps={appProps}
            closeCallback={closeCallback}
            exitCallback={exitCallback}
            isEditor={isEditor}
            isStandalone={isStandalone}
            additionalButtonRefs={ADDITIONAL_BUTTON_REFS}
            additionalButtons={additionalButtons}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS &&
          (type === 'mednafen-ws' || type === 'mednafen-wsc') ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(TEXT_IDS.GAMEPAD_CONTROLS),
                content: <WonderSwanGamepadControls />,
              },
              {
                image: GamepadWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.GAMEPAD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.ROTATED),
                ),
                content: <WonderSwanGamepadControlsRotated />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(TEXT_IDS.KEYBOARD_CONTROLS),
                content: <WonderSwanKeyboardControls />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.KEYBOARD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.ROTATED),
                ),
                content: <WonderSwanKeyboardControlsRotated />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS && type === 'mednafen-lnx' ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(TEXT_IDS.GAMEPAD_CONTROLS),
                content: <LynxGamepadControls />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(TEXT_IDS.KEYBOARD_CONTROLS),
                content: <LynxKeyboardControls />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS &&
          (type === 'mednafen-ngc' || type === 'mednafen-ngp') ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(TEXT_IDS.GAMEPAD_CONTROLS),
                content: <NgpGamepadControls />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(TEXT_IDS.KEYBOARD_CONTROLS),
                content: <NgpKeyboardControls />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS &&
          (type === 'mednafen-pce' || type === 'mednafen-sgx') &&
          appProps.pad6button !== true ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.GAMEPAD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.TWO_BUTTON),
                ),
                content: <Pce2GamepadControls mapRunSelect={appProps.mapRunSelect} />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.KEYBOARD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.TWO_BUTTON),
                ),
                content: <Pce2KeyboardControls mapRunSelect={appProps.mapRunSelect} />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.CONTROLS &&
          (type === 'mednafen-pce' || type === 'mednafen-sgx') &&
          appProps.pad6button === true ? (
          <EditorScreen
            onClose={closeCallback}
            tabs={[
              {
                image: GamepadWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.GAMEPAD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.SIX_BUTTON),
                ),
                content: <Pce6GamepadControls />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.KEYBOARD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.SIX_BUTTON),
                ),
                content: <Pce6KeyboardControls />,
              },
            ]}
          />
        ) : null}
        {mode === ModeEnum.SETTINGS ? (
          <AppSettingsEditor
            emulator={emulator}
            onClose={closeCallback}
          />
        ) : null}
        {mode === ModeEnum.STATE ? (
          <SaveStatesEditor
            emptyImageSrc={
              type === 'mednafen-pce' ? PceBackground :
                type === 'mednafen-sgx' ? SgxBackground :
                  type === 'mednafen-ngp' ? NgpBackground :
                    type === 'mednafen-lnx' ? LynxBackground :
                      type === 'mednafen-ws' ? WsBackground :
                        type === 'mednafen-wsc' ? WscBackground :
                          type === 'mednafen-ngc' ? NgcBackground : VbBackground}
            emulator={emulator}
            onClose={closeCallback}
            showStatusCallback={emulator.saveMessageCallback}
          />
        ) : null}
      </>
    );
  }
}
