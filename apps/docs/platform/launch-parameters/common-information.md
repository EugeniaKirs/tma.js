# Common Information

The launch parameters are the list of parameters that is passed by the native Telegram application
to the Mini App. It helps the developer to find out the characteristics of the Telegram application,
the current device, get basic information about the user and much more.

## Transmission Method

It's easy to guess, but in a web environment, one of the simplest and most instantaneous ways to
transfer data in a local environment is to specify them in the address bar of the application. Thus,
both the called server and the downloaded application will have some pre-known data. Actually,
Telegram Mini Apps technology uses the same algorithm.

The native Telegram application transmits a list of these parameters in the dynamic part of the
URL (in the hash, `#`). Accordingly, in order to access these parameters, it is necessary to access
the `window.location.hash` property from the JavaScript code.

## Extraction

It is important to remember that `hash` is a string property, while Telegram transmits a whole list
of properties, after which the question arises about formatting and processing this list. In fact,
everything is quite simple.

The native Telegram application passes the list of launch parameters as query-parameters and saves
the resulting string in `window.location.hash`. For this reason, in order to extract the launch
parameters, it is enough to perform the following operation:

```typescript title="Example on how to extract launch parameters"
const hash = window.location.hash.slice(1);
console.log(hash); // tgWebAppData=...&tgWebAppVersion=6.2&...

const params = new URLSearchParams(hash);
console.log(params.get('tgWebAppVersion')); // "6.2"
```

::: tip

However, users have the capability to refresh the current application without exiting it. If the
application uses hash routing, it may lose the initial hash after some time. Therefore, it's
advisable to save this data during the initial launch of the application.

:::

## Parameters List

### `tgWebAppVersion`

The current Telegram Mini Apps version used by the native application. This parameter is important
to use, for example, before calling the Telegram Mini
Apps [methods](../apps-communication/methods.md) to make sure, they are supported.

### `tgWebAppData`

Contains data describing the current user, data sign, and also some useful values. To learn more,
visit the [Init Data](./init-data) page.

This parameter is passed as query parameters, so in order to get a more user-friendly value, a
developer need to use the `URLSearchParams` constructor:

```typescript
const initData = new URLSearchParams(params.get('tgWebAppData'));

// ['user', '{"id":279058397,"first_name":"Vladislav", ... }']
// ['chat_instance', '8428209589180549439']
// ['chat_type', 'sender']
// ['auth_date', '1698272211']
// ['hash', 'ddc15fc7419ae9cb9a597b98efee42ea0']
```

### `tgWebAppPlatform`

[Telegram application identifier](../about-platform.md#supported-applications). It can be used as a factor
determining the visual style of the application, for example, when, depending on the device, the
developer needs to display components that are different visually.

### `tgWebAppThemeParams`

Parameters of the native Telegram application [theme](../functionality/theming.md). This parameter
can be used to style the application even at the moment of rendering the loader.

The value of this parameter is a JSON object converted to the string. To get a more user-friendly
value, it is enough to use the `JSON.parse` method.

```typescript
const theme = {
  bg_color: '#212121',
  text_color: '#ffffff',
  hint_color: '#aaaaaa',
  link_color: '#8774e1',
  button_color: '#8774e1',
  button_text_color: '#ffffff',
  secondary_bg_color: '#0f0f0f',
};
```

### `tgWebAppShowSettings`

Parameter used only by Telegram SDK to show the Settings Button on startup. It has
no other meaning to external developers.

### `tgWebAppBotInline`

This parameter is being added in case the current application is launched in inline mode. This
allows calling such Telegram Mini Apps method
as [web_app_switch_inline_query](../apps-communication/methods.md#web-app-switch-inline-query).

### `tgWebAppStartParam`

This parameter is being included in case, bot link contains such query parameter as `startattach`,
or Direct Link contains the `startapp` query parameter.

Here are the examples:

- `https://t.me/botusername?startattach=PARAM`
- `https://t.me/botusername/appname?startapp=PARAM`

In both of these cases, `tgWebAppStartParam` will be set to `"PARAM"`.

::: info

This launch parameter is not included in the location hash. Instead, it can be found in a
URL query parameters.

:::