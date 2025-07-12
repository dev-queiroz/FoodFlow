/// <reference lib="webworker" />

declare const self: ServiceWorkerGlobalScope;

declare global {
  // Extend the ServiceWorkerGlobalScope to include the event types
  interface ServiceWorkerGlobalScope {
    __WB_MANIFEST: string[];
    skipWaiting(): Promise<void>;
  }

  // Extend the ExtendableEvent interface to include the waitUntil method
  interface ExtendableEvent extends Event {
    waitUntil(fn: Promise<any>): void;
  }

  // Define the FetchEvent interface
  interface FetchEvent extends ExtendableEvent {
    readonly clientId: string;
    readonly preloadResponse: Promise<any>;
    readonly request: Request;
    readonly resultingClientId: string;
    respondWith(response: Promise<Response> | Response): void;
  }

  // Define the SyncEvent interface
  interface SyncEvent extends ExtendableEvent {
    readonly lastChance: boolean;
    readonly tag: string;
  }

  // Add the event types to the global scope
  interface ServiceWorkerGlobalScopeEventMap {
    'install': ExtendableEvent;
    'activate': ExtendableEvent;
    'fetch': FetchEvent;
    'sync': SyncEvent;
  }
}
