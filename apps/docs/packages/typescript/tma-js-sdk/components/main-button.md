# `MainButton`

Implements Telegram Mini Apps [Main Button](../../../../platform/ui/main-button.md).

## Initialization

The component constructor accepts an object with a specified background color, activity state,
visibility state, progress visibility state, text, and its color. It also accepts an optional
function to call Telegram Mini Apps methods.

```typescript
import { MainButton, postEvent } from '@tma.js/sdk';

const mainButton = new MainButton({
  backgroundColor: '#aaddfe',
  isEnabled: false,
  isVisible: false,
  isLoaderVisible: false,
  text: 'SUBMIT',
  textColor: '#ffffff',
  postEvent,
});
```

## Button visibility

To control the Main Button visibility, developer could use such methods as `show()` and `hide()`.
Both of them update component's `isVisible` property:

```typescript  
mainButton.show();
console.log(mainButton.isVisible); // true  

mainButton.hide();
console.log(mainButton.isVisible); // false  
```

## Loader

The Main Button could display a loader inside of it. To control its visibility,
use `showLoader()` and `hideLoader()` methods. The `isLoaderVisible` property will be changed.

```typescript
mainButton.showLoader();
console.log(mainButton.isLoaderVisible); // true  

mainButton.hideLoader();
console.log(mainButton.isLoaderVisible); // false
```

## Active state

The Main Button can be enabled and disabled by calling `disable()` and `enable()` methods. Both of
the methods will update the `isEnabled` property.

```typescript
mainButton.enable();
console.log(mainButton.isEnabled); // true  

mainButton.disable();
console.log(mainButton.isEnabled); // false
```

Enabling the Main Button will allow a user to click it. As the result, the Main Button will
receive the `click` event.

## Background color

To update the Main Button background color, use the `setBackgroundColor(color: RGB)` method. It
will update the `backgroundColor` property.

```typescript 
mainButton.setBackgroundColor('#ffffaa');
console.log(mainButton.color); // '#ffffaa'
```

## Text color

To update the Main Button text color, use the `setTextColor(color: RGB)` method. It will update
the `textColor` property.

```typescript 
mainButton.setTextColor('#cca233');
console.log(mainButton.textColor); // '#cca233'
```

## Text

To update the Main Button text, use the `setText(text: string)` method. It will update the `text`
property.

```typescript
mainButton.setText('Submit');
console.log(mainButton.text); // 'Submit'
```

## Setting multiple properties

Sometimes, a consecutive set of several Main Button parameters may lead to problematic artifacts in
the UI. To avoid this issue, it is allowed to use the `setParams` method:

```typescript
mainButton.setParams({
  backgroundColor: '#aa1388',
  text: 'Stop',
  isVisible: true,
});
```

## Events

List of events, which could be used in `on` and `off` component instance methods:

| Event                  | Listener                   | Triggered when                     |
|------------------------|----------------------------|------------------------------------|
| click                  | `() => void`               | Main Button was clicked            |
| change                 | `() => void`               | Something in component changed     |
| change:backgroundColor | `(value: RGB) => void`     | `backgroundColor` property changed |
| change:isLoaderVisible | `(value: boolean) => void` | `isLoaderVisible` property changed |
| change:isEnabled       | `(value: boolean) => void` | `isEnabled` property changed       |
| change:isVisible       | `(value: boolean) => void` | `isVisible` property changed       |
| change:text            | `(value: string) => void`  | `text` property changed            |
| change:textColor       | `(value: RGB) => void`     | `textColor` property changed       |
