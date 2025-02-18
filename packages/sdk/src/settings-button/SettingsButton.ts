import {
  off,
  on,
  type PostEvent,
  postEvent as defaultPostEvent,
} from '~/bridge/index.js';
import { EventEmitter } from '~/event-emitter/index.js';
import { State } from '~/state/index.js';
import { createSupportsFunc, type SupportsFunc } from '~/supports/index.js';
import type { Version } from '~/version/index.js';

import type { SettingsButtonEvents, SettingsButtonState } from './types.js';

type Emitter = EventEmitter<SettingsButtonEvents>;

export class SettingsButton {
  private readonly ee: Emitter = new EventEmitter();

  private readonly state: State<SettingsButtonState>;

  constructor(
    isVisible: boolean,
    version: Version,
    private readonly postEvent: PostEvent = defaultPostEvent,
  ) {
    this.state = new State({ isVisible }, this.ee);
    this.supports = createSupportsFunc(version, {
      show: 'web_app_setup_settings_button',
      hide: 'web_app_setup_settings_button',
    });
  }

  private set isVisible(visible: boolean) {
    this.state.set('isVisible', visible);
    this.postEvent('web_app_setup_settings_button', { is_visible: visible });
  }

  /**
   * True if SettingsButton is currently visible.
   */
  get isVisible(): boolean {
    return this.state.get('isVisible');
  }

  /**
   * Hides the SettingsButton.
   */
  hide(): void {
    this.isVisible = false;
  }

  /**
   * Adds event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  on: Emitter['on'] = (event, listener) => (
    event === 'click'
      ? on('settings_button_pressed', listener)
      : this.ee.on(event, listener)
  );

  /**
   * Removes event listener.
   * @param event - event name.
   * @param listener - event listener.
   */
  off: Emitter['off'] = (event, listener) => (
    event === 'click'
      ? off('settings_button_pressed', listener)
      : this.ee.off(event, listener)
  );

  /**
   * Shows the SettingsButton.
   */
  show(): void {
    this.isVisible = true;
  }

  /**
   * Checks if specified method is supported by current component.
   */
  supports: SupportsFunc<'show' | 'hide'>;
}
