import React from "react";

import {
  ControlsTab,
} from '@webrcade/app-common'

export class WonderSwanGamepadControls extends ControlsTab {
  render() {
    return (
      <>
        {[
            this.renderControl("start", "Start"),
            this.renderControl("select", "Rotate"),
            this.renderControl("dpad", "X Buttons"),
            this.renderControl("lanalog", "X Buttons"),
            this.renderControl("rtrig", "Y1"),
            this.renderControl("rbump", "Y2"),
            this.renderControl("ltrig", "Y3"),
            this.renderControl("lbump", "Y4"),
            this.renderControl("a", "B"),
            this.renderControl("y", "B"),
            this.renderControl("b", "A"),
            this.renderControl("x", "A"),
          ]}
      </>
    );
  }
}

export class WonderSwanKeyboardControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Start"),
          this.renderKey("ShiftRight", "Rotate"),
          this.renderKey("ArrowUp", "X1"),
          this.renderKey("ArrowDown", "X3"),
          this.renderKey("ArrowLeft", "X4"),
          this.renderKey("ArrowRight", "X2"),
          this.renderKey("KeyQ", "Y4"),
          this.renderKey("KeyW", "Y2"),
          this.renderKey("KeyZ", "B"),
          this.renderKey("KeyS", "B"),
          this.renderKey("KeyX", "A"),
          this.renderKey("KeyA", "A"),
        ]}
      </>
    );
  }
}

export class WonderSwanGamepadControlsRotated extends ControlsTab {
  render() {
    return (
      <>
        {[
            this.renderControl("start", "Start"),
            this.renderControl("select", "Rotate"),
            this.renderControl("dpad", "Y Buttons"),
            this.renderControl("lanalog", "Y Buttons"),
            this.renderControl("ranalog", "X Buttons"),
            this.renderControl("x", "X1"),
            this.renderControl("y", "X2"),
            this.renderControl("b", "X3"),
            this.renderControl("a", "X4"),
            this.renderControl("lbump", "A"),
            this.renderControl("rbump", "B"),
          ]}
      </>
    );
  }
}

export class WonderSwanKeyboardControlsRotated extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Start"),
          this.renderKey("ShiftRight", "Rotate"),
          this.renderKey("ArrowUp", "Y2"),
          this.renderKey("ArrowDown", "Y4"),
          this.renderKey("ArrowLeft", "Y1"),
          this.renderKey("ArrowRight", "Y3"),
          this.renderKey("KeyA", "X1"),
          this.renderKey("KeyS", "X2"),
          this.renderKey("KeyX", "X3"),
          this.renderKey("KeyZ", "X4"),
          this.renderKey("KeyQ", "A"),
          this.renderKey("KeyW", "B"),
        ]}
      </>
    );
  }
}

export class LynxGamepadControls extends ControlsTab {
  render() {
    return (
      <>
        {[
            this.renderControl("start", "Lynx Pause"),
            this.renderControl("dpad", "Move"),
            this.renderControl("lanalog", "Move"),
            this.renderControl("b", "A"),
            this.renderControl("x", "A"),
            this.renderControl("a", "B"),
            this.renderControl("y", "B"),
            this.renderControl("lbump", "Option 1"),
            this.renderControl("rbump", "Option 2"),
          ]}
      </>
    );
  }
}

export class LynxKeyboardControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Lynx Pause"),
          this.renderKey("ArrowUp", "Up"),
          this.renderKey("ArrowDown", "Down"),
          this.renderKey("ArrowLeft", "Left"),
          this.renderKey("ArrowRight", "Right"),
          this.renderKey("KeyX", "A"),
          this.renderKey("KeyA", "A"),
          this.renderKey("KeyZ", "B"),
          this.renderKey("KeyS", "B"),
          this.renderKey("KeyQ", "Option 1"),
          this.renderKey("KeyW", "Option 2"),
        ]}
      </>
    );
  }
}

export class NgpGamepadControls extends ControlsTab {
  render() {
    return (
      <>
        {[
            this.renderControl("start", "Option"),
            this.renderControl("dpad", "Move"),
            this.renderControl("lanalog", "Move"),
            this.renderControl("a", "A"),
            this.renderControl("y", "A"),
            this.renderControl("b", "B"),
            this.renderControl("x", "B"),
          ]}
      </>
    );
  }
}

export class NgpKeyboardControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Option"),
          this.renderKey("ArrowUp", "Up"),
          this.renderKey("ArrowDown", "Down"),
          this.renderKey("ArrowLeft", "Left"),
          this.renderKey("ArrowRight", "Right"),
          this.renderKey("KeyZ", "A"),
          this.renderKey("KeyS", "A"),
          this.renderKey("KeyX", "B"),
          this.renderKey("KeyA", "B"),
        ]}
      </>
    );
  }
}

export class Pce2GamepadControls extends ControlsTab {
  render() {
    return (
      <>
        {[
            this.renderControl("start", "Run"),
            this.renderControl("select", "Select"),
            this.renderControl("dpad", "Move"),
            this.renderControl("lanalog", "Move"),
            this.renderControl("b", "I"),
            this.renderControl("x", "I"),
            this.renderControl("a", "II"),
            this.renderControl("y", "II"),
          ]}
      </>
    );
  }
}

export class Pce2KeyboardControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Run"),
          this.renderKey("ShiftRight", "Select"),
          this.renderKey("ArrowUp", "Up"),
          this.renderKey("ArrowDown", "Down"),
          this.renderKey("ArrowLeft", "Left"),
          this.renderKey("ArrowRight", "Right"),
          this.renderKey("KeyX", "I"),
          this.renderKey("KeyA", "I"),
          this.renderKey("KeyZ", "II"),
          this.renderKey("KeyS", "II"),
        ]}
      </>
    );
  }
}

export class Pce6GamepadControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderControl("start", "Run"),
            this.renderControl("select", "Select"),
            this.renderControl("dpad", "Move"),
            this.renderControl("lanalog", "Move"),
            this.renderControl("b", "I"),
            this.renderControl("a", "II"),
            this.renderControl("y", "III"),
            this.renderControl("x", "IV"),
            this.renderControl("lbump", "V"),
            this.renderControl("rbump", "VI"),
          ]}
      </>
    );
  }
}

export class Pce6KeyboardControls extends ControlsTab {
  render() {
    return (
      <>
        {[
          this.renderKey("Enter", "Run"),
          this.renderKey("ShiftRight", "Select"),
          this.renderKey("ArrowUp", "Up"),
          this.renderKey("ArrowDown", "Down"),
          this.renderKey("ArrowLeft", "Left"),
          this.renderKey("ArrowRight", "Right"),
          this.renderKey("KeyX", "I"),
          this.renderKey("KeyZ", "II"),
          this.renderKey("KeyS", "III"),
          this.renderKey("KeyA", "IV"),
          this.renderKey("KeyQ", "V"),
          this.renderKey("KeyW", "VI"),
        ]}
      </>
    );
  }
}
