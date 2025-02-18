import { expect, vi, beforeEach, afterEach, it } from 'vitest';

import { on, off } from '../../src/index.js';
import { createWindow, type WindowSpy } from '../../test-utils/createWindow.js';
import { dispatchWindowMessageEvent } from '../../test-utils/dispatchWindowMessageEvent.js';

let windowSpy: WindowSpy;

beforeEach(() => {
  windowSpy = createWindow();
});

afterEach(() => {
  windowSpy.mockRestore();
});

it('should remove listener', () => {
  const listener = vi.fn();
  const emit = () => dispatchWindowMessageEvent('viewport_changed', {
    height: 123,
    width: 321,
    is_expanded: false,
    is_state_stable: false,
  });

  on('viewport_changed', listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);

  off('viewport_changed', listener);
  emit();
  expect(listener).toHaveBeenCalledTimes(1);
});
