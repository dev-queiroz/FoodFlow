// Extensões de tipo para o Service Worker
declare const self: ServiceWorkerGlobalScope;

// Tipos para os eventos do Service Worker
interface ExtendableEvent extends Event {
  waitUntil(fn: Promise<any>): void;
}

interface FetchEvent extends ExtendableEvent {
  readonly clientId: string;
  readonly preloadResponse: Promise<any>;
  readonly replacesClientId: string;
  readonly resultingClientId: string;
  readonly request: Request;
  respondWith(response: Promise<Response> | Response): void;
}

// Tipos para notificações push
interface PushEvent extends ExtendableEvent {
  readonly data: PushMessageData;
}

interface NotificationEvent extends ExtendableEvent {
  readonly notification: Notification;
  readonly action?: string;
}

// Tipos para sincronização em segundo plano
declare var SyncEvent: {
  prototype: SyncEvent;
  new(type: string, eventInitDict?: SyncEventInit): SyncEvent;
};

interface SyncEvent extends ExtendableEvent {
  readonly lastChance: boolean;
  readonly tag: string;
}

interface SyncEventInit extends ExtendableEventInit {
  lastChance?: boolean;
  tag?: string;
}

// Tipos para mudanças na assinatura push
declare var PushSubscriptionChangeEvent: {
  prototype: PushSubscriptionChangeEvent;
  new(type: string, eventInitDict?: PushSubscriptionChangeEventInit): PushSubscriptionChangeEvent;
};

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  readonly newSubscription?: PushSubscription;
  readonly oldSubscription?: PushSubscription;
}

interface PushSubscriptionChangeEventInit extends ExtendableEventInit {
  newSubscription?: PushSubscription;
  oldSubscription?: PushSubscription;
}

// Constantes para estratégias de cache
type CacheStrategy = 'CacheFirst' | 'NetworkFirst' | 'StaleWhileRevalidate' | 'NetworkOnly' | 'CacheOnly';

// Interface para o objeto de cache
interface CacheStorage {
  delete(cacheName: string): Promise<boolean>;
  has(cacheName: string): Promise<boolean>;
  keys(): Promise<string[]>;
  match(request: Request | URL, options?: CacheQueryOptions): Promise<Response | undefined>;
  open(cacheName: string): Promise<Cache>;
}

// Interface para o objeto clients
declare class Clients {
  static get(id: string): Promise<Client>;
  static matchAll(options?: ClientQueryOptions): Promise<Client[]>;
  static openWindow(url: string): Promise<WindowClient | null>;
  static claim(): Promise<void>;
}

// Adiciona tipos globais para o Service Worker
declare var caches: CacheStorage;
declare var clients: Clients;
declare function skipWaiting(): Promise<void>;

// Mapa de eventos do Service Worker
declare interface ServiceWorkerGlobalScopeEventMap {
  'install': ExtendableEvent;
  'activate': ExtendableEvent;
  'fetch': FetchEvent;
  'sync': SyncEvent;
  'push': PushEvent;
  'notificationclick': NotificationEvent;
  'notificationclose': NotificationEvent;
  'pushsubscriptionchange': PushSubscriptionChangeEvent;
}

// Adiciona os tipos ao ServiceWorkerGlobalScope
interface ServiceWorkerGlobalScope {
  addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    listener: (event: ServiceWorkerGlobalScopeEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  
  removeEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    listener: (event: ServiceWorkerGlobalScopeEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  
  dispatchEvent(event: Event): boolean;
  
  // Propriedades específicas do Service Worker
  readonly clients: Clients;
  readonly registration: ServiceWorkerRegistration;
  
  // Métodos específicos do Service Worker
  skipWaiting(): Promise<void>;
}
