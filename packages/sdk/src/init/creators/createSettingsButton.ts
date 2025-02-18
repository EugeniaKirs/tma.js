import { SettingsButton } from '~/settings-button/index.js';
import { getStorageValue, saveStorageValue } from '~/storage.js';
import type { PostEvent } from '~/bridge/index.js';

/**
 * Creates SettingsButton instance using last locally saved data also saving each state in
 * the storage.
 * @param isPageReload - was current page reloaded.
 * @param version - platform version.
 * @param postEvent - Bridge postEvent function
 */
export function createSettingsButton(
  isPageReload: boolean,
  version: string,
  postEvent: PostEvent,
): SettingsButton {
  const { isVisible = false } = isPageReload ? getStorageValue('settings-button') || {} : {};
  const component = new SettingsButton(isVisible, version, postEvent);

  component.on('change', () => {
    saveStorageValue('settings-button', { isVisible: component.isVisible });
  });

  return component;
}
