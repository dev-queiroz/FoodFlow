<template>
  <transition name="slide-up">
    <div 
      v-if="isVisible"
      class="notification"
      :class="[`notification-${type}`]"
      @click="dismiss"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <component :is="iconComponent" class="h-5 w-5" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">{{ title }}</h3>
          <p class="mt-1 text-sm text-gray-700">{{ message }}</p>
        </div>
        <button 
          class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-500 focus:outline-none"
          @click.stop="dismiss"
        >
          <span class="sr-only">Fechar</span>
          <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export default defineComponent({
  name: 'Notification',
  props: {
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      required: true
    },
    type: {
      type: String as () => NotificationType,
      default: 'info',
      validator: (value: string) => 
        ['success', 'error', 'warning', 'info'].includes(value)
    },
    duration: {
      type: Number,
      default: 5000 // 5 segundos
    },
    dismissible: {
      type: Boolean,
      default: true
    }
  },
  emits: ['dismiss'],
  setup(props, { emit }) {
    const isVisible = ref(true);
    let timeoutId: number | null = null;

    const iconComponent = computed(() => {
      const icons = {
        success: 'CheckCircle',
        error: 'XCircle',
        warning: 'ExclamationCircle',
        info: 'InformationCircle'
      };
      
      // Usando ícones do Heroicons (que serão importados no componente pai)
      return icons[props.type as keyof typeof icons] || 'InformationCircle';
    });

    const dismiss = () => {
      isVisible.value = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      // Aguarda a animação terminar antes de emitir o evento
      setTimeout(() => {
        emit('dismiss', props.id);
      }, 300);
    };

    onMounted(() => {
      if (props.duration > 0) {
        timeoutId = window.setTimeout(() => {
          dismiss();
        }, props.duration);
      }
    });

    return {
      isVisible,
      iconComponent,
      dismiss
    };
  }
});
</script>

<style scoped>
.notification {
  @apply rounded-lg p-4 shadow-lg max-w-sm w-full mb-2;
  @apply flex items-start;
  @apply cursor-pointer;
  @apply transition-all duration-200 ease-in-out;
}

.notification-success {
  @apply bg-green-50 border-l-4 border-green-400;
}

.notification-error {
  @apply bg-red-50 border-l-4 border-red-400;
}

.notification-warning {
  @apply bg-yellow-50 border-l-4 border-yellow-400;
}

.notification-info {
  @apply bg-blue-50 border-l-4 border-blue-400;
}

/* Animações */
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
