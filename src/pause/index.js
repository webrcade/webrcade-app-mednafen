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
  CustomPauseScreen,
  EditorScreen,
  GamepadWhiteImage,
  KeyboardWhiteImage,
  PauseScreenButton,
  Resources,
  TEXT_IDS,
} from '@webrcade/app-common';

export class EmulatorPauseScreen extends Component {
  constructor() {
    super();
    this.state = {
      mode: this.ModeEnum.PAUSE,
    };
  }

  ModeEnum = {
    PAUSE: 'pause',
    CONTROLS: 'controls',
  };

  ADDITIONAL_BUTTON_REFS = [React.createRef()];

  render() {
    const { ADDITIONAL_BUTTON_REFS, ModeEnum } = this;
    const { appProps, closeCallback, exitCallback, isEditor, isStandalone, type } =
      this.props;
    const { mode } = this.state;

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
            additionalButtons={[
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
            ]}
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
                content: <Pce2GamepadControls />,
              },
              {
                image: KeyboardWhiteImage,
                label: Resources.getText(
                  TEXT_IDS.KEYBOARD_CONTROLS_DETAIL,
                  Resources.getText(TEXT_IDS.TWO_BUTTON),
                ),
                content: <Pce2KeyboardControls />,
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
      </>
    );
  }
}
