import { ref, computed } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
  dismissible?: boolean;
}

export function useNotification() {
  const notifications = ref<Notification[]>([]);
  
  // Ícones do Heroicons para cada tipo de notificação
  const notificationIcons = {
    success: {
      path: 'M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z',
      viewBox: '0 0 20 20',
      class: 'text-green-400'
    },
    error: {
      path: 'M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z',
      viewBox: '0 0 20 20',
      class: 'text-red-400'
    },
    warning: {
      path: 'M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z',
      viewBox: '0 0 20 20',
      class: 'text-yellow-400'
    },
    info: {
      path: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 011-1v0a.5.5 0 01.5.5v3.5a.5.5 0 01-1 0V10a1 1 0 01-.5-.866z',
      viewBox: '0 0 20 20',
      class: 'text-blue-400'
    }
  };

  // Adiciona uma nova notificação
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = `notification-${Date.now()}`;
    const newNotification = {
      id,
      duration: 5000,
      dismissible: true,
      ...notification
    };
    
    notifications.value.push(newNotification);
    
    // Remove a notificação após a duração especificada
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }
    
    return id;
  };
  
  // Remove uma notificação pelo ID
  const removeNotification = (id: string) => {
    const index = notifications.value.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications.value.splice(index, 1);
    }
  };
  
  // Métodos auxiliares para cada tipo de notificação
  const success = (message: string, title = 'Sucesso!', options: Partial<Omit<Notification, 'type' | 'message' | 'title'>> = {}) => {
    return addNotification({
      ...options,
      title,
      message,
      type: 'success'
    });
  };
  
  const error = (message: string, title = 'Erro!', options: Partial<Omit<Notification, 'type' | 'message' | 'title'>> = {}) => {
    return addNotification({
      ...options,
      title,
      message,
      type: 'error'
    });
  };
  
  const warning = (message: string, title = 'Atenção!', options: Partial<Omit<Notification, 'type' | 'message' | 'title'>> = {}) => {
    return addNotification({
      ...options,
      title,
      message,
      type: 'warning'
    });
  };
  
  const info = (message: string, title = 'Informação', options: Partial<Omit<Notification, 'type' | 'message' | 'title'>> = {}) => {
    return addNotification({
      ...options,
      title,
      message,
      type: 'info'
    });
  };
  
  // Componente de notificação para ser usado no template
  const NotificationComponent = {
    name: 'NotificationContainer',
    setup() {
      return {
        notifications: computed(() => notifications.value),
        removeNotification
      };
    },
    template: `
      <transition-group name="slide-up" class="fixed bottom-4 right-4 z-50 space-y-2">
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="notification"
          :class="['notification-' + notification.type, { 'cursor-pointer': notification.dismissible }]"
          @click="notification.dismissible && removeNotification(notification.id)"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0">
              <svg 
                class="h-5 w-5" 
                :class="$options.icons[notification.type].class" 
                fill="currentColor" 
                :viewBox="$options.icons[notification.type].viewBox"
                aria-hidden="true"
              >
                <path fill-rule="evenodd" :d="$options.icons[notification.type].path" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3 w-0 flex-1 pt-0.5">
              <p class="text-sm font-medium text-gray-900">
                {{ notification.title }}
              </p>
              <p class="mt-1 text-sm text-gray-600">
                {{ notification.message }}
              </p>
            </div>
            <div class="ml-4 flex-shrink-0 flex">
              <button 
                v-if="notification.dismissible"
                @click.stop="removeNotification(notification.id)"
                class="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <span class="sr-only">Fechar</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    `,
    // Adiciona os ícones como opção do componente
    icons: notificationIcons
  };

  return {
    // Estado
    notifications: computed(() => notifications.value),
    
    // Ações
    add: addNotification,
    remove: removeNotification,
    success,
    error,
    warning,
    info,
    
    // Componente
    NotificationComponent
  };
}

export default useNotification;
