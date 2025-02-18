import type { MiniAppsEventListener, MiniAppsEventName } from './events.js';
import { off } from './off.js';
import { singletonEmitter } from './singletonEmitter.js';

type StopListening = () => void;

/**
 * Adds new listener to the specified event. Returns handler
 * which allows to stop listening to event.
 * @param event - event name.
 * @param listener - event listener.
 */
export function on<E extends MiniAppsEventName>(
  event: E,
  listener: MiniAppsEventListener<E>,
): StopListening {
  singletonEmitter().on(event, listener);
  return () => off(event, listener);
}
