import { serializeThemeParams } from '~/theme-params/index.js';

import type { LaunchParams } from './types.js';

/**
 * Converts launch parameters to its initial representation.
 * @param value - launch parameters.
 */
export function serializeLaunchParams(value: LaunchParams): string {
  const {
    initDataRaw,
    themeParams,
    platform,
    version,
    showSettings,
    botInline,
  } = value;

  const params = new URLSearchParams();

  if (initDataRaw) {
    params.set('tgWebAppData', initDataRaw);
  }
  params.set('tgWebAppPlatform', platform);
  params.set('tgWebAppThemeParams', serializeThemeParams(themeParams));
  params.set('tgWebAppVersion', version);

  if (typeof showSettings === 'boolean') {
    params.set('tgWebAppShowSettings', showSettings ? '1' : '0');
  }

  if (typeof botInline === 'boolean') {
    params.set('tgWebAppBotInline', botInline ? '1' : '0');
  }

  return params.toString();
}
