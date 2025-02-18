import { withTimeout, isRecord } from '@tma.js/utils';
import type { And, If, IsNever } from '@tma.js/util-types';

import { postEvent as defaultPostEvent, type PostEvent } from './methods/postEvent.js';
import { on, type EventName, type EventParams, type EventHasParams } from './events/index.js';

import type {
  EmptyMethodName,
  MethodAcceptParams,
  MethodName,
  MethodParams,
  NonEmptyMethodName,
} from './methods/methods.js';

/**
 * Names of methods, which require passing "req_id" parameter.
 */
type MethodWithRequestId = {
  [M in MethodName]: If<
    And<MethodAcceptParams<M>, MethodParams<M> extends { req_id: string } ? true : false>,
    M,
    never
  >;
}[MethodName];

/**
 * Names of events, which contain "req_id" parameter.
 */
type EventWithRequestId = {
  [E in EventName]: If<
    And<EventHasParams<E>, EventParams<E> extends { req_id: string } ? true : false>,
    E,
    never
  >;
}[EventName];

export interface RequestOptions {
  /**
   * Bridge postEvent method.
   * @default Global postEvent method.
   */
  postEvent?: PostEvent;

  /**
   * Execution timeout.
   */
  timeout?: number;
}

export interface RequestOptionsAdvanced<EventPayload> extends RequestOptions {
  /**
   * Should return true in case, this event should be captured. If not specified,
   * request is not skipping captured events.
   */
  capture?: If<IsNever<EventPayload>, () => boolean, (payload: EventPayload) => boolean>;
}

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, event with specified in method request identifier
 * was captured.
 * @param method - method to execute.
 * @param params - method parameters.
 * @param event - event or events to listen.
 * @param options - additional execution options.
 */
export function request<M extends MethodWithRequestId, E extends EventWithRequestId>(
  method: M,
  params: MethodParams<M>,
  event: E | E[],
  options?: RequestOptions,
): Promise<EventParams<E>>;

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method to execute.
 * @param event - event or events to listen.
 * @param options - additional execution options.
 */
export function request<M extends EmptyMethodName, E extends EventName>(
  method: M,
  event: E | E[],
  options?: RequestOptionsAdvanced<EventParams<E>>,
): Promise<EventParams<E>>;

/**
 * Calls specified TWA method and captures one of the specified events. Returns promise
 * which will be resolved in case, specified event was captured.
 * @param method - method to execute
 * @param params - method parameters.
 * @param event - event or events to listen
 * @param options - additional execution options.
 */
export function request<M extends NonEmptyMethodName, E extends EventName>(
  method: M,
  params: MethodParams<M>,
  event: E | E[],
  options?: RequestOptionsAdvanced<EventParams<E>>,
): Promise<EventParams<E>>;

export function request(
  method: MethodName,
  eventOrParams: EventName | EventName[] | EventParams<any>,
  eventOrOptions?: EventName | EventName[] | RequestOptions | RequestOptionsAdvanced<any>,
  options?: RequestOptions | RequestOptionsAdvanced<any>,
): Promise<any> {
  let executionOptions: RequestOptions | RequestOptionsAdvanced<any> | undefined;
  let methodParams: EventParams<any> | undefined;
  let events: EventName[];
  let requestId: string | undefined;

  if (typeof eventOrParams === 'string' || Array.isArray(eventOrParams)) {
    // Override: [method, event, options?]
    events = Array.isArray(eventOrParams) ? eventOrParams : [eventOrParams] as EventName[];
    executionOptions = eventOrOptions as (RequestOptionsAdvanced<any> | undefined);
  } else {
    // Override: [method, params, event, options?]
    methodParams = eventOrParams as EventParams<any>;
    events = Array.isArray(eventOrOptions) ? eventOrOptions : [eventOrOptions] as EventName[];
    executionOptions = options;
  }

  // In case, method parameters were passed, and they contained request identifier, we should store
  // it and wait for the event with this identifier to occur.
  if (isRecord(methodParams) && typeof methodParams.req_id === 'string') {
    requestId = methodParams.req_id;
  }

  const { postEvent = defaultPostEvent, timeout } = executionOptions || {};
  const capture = executionOptions && 'capture' in executionOptions
    ? executionOptions.capture
    : null;

  const promise = new Promise((res, rej) => {
    // Iterate over each event and create event listener.
    const stoppers = events.map((ev) => on(ev, (data?) => {
      // If request identifier was specified, we are waiting for event with the same value
      // to occur.
      if (typeof requestId === 'string' && (!isRecord(data) || data.req_id !== requestId)) {
        return;
      }

      if (typeof capture === 'function' && !capture(data)) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      stopListening();
      res(data);
    }));

    // Function which removes all event listeners.
    const stopListening = () => stoppers.forEach((stop) => stop());

    try {
      // We are wrapping this call in try catch, because it can throw errors in case,
      // compatibility check was enabled. We want an error to be captured by promise, not by
      // another one external try catch.
      postEvent(method as any, methodParams);
    } catch (e) {
      stopListening();
      rej(e);
    }
  });

  return typeof timeout === 'number' ? withTimeout(promise, timeout) : promise;
}
