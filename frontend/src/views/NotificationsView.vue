<template>
  <div class="dashboard-layout">
    <SidebarMenu />
    <div class="dashboard-content">
      <h1>Notificações</h1>
      
      <div class="notifications-list">
        <div 
          v-for="(notification, index) in notifications" 
          :key="index"
          class="notification-item"
          :class="{ 'unread': !notification.read }"
        >
          <div class="notification-icon">
            <span v-if="notification.type === 'order'">🛒</span>
            <span v-else-if="notification.type === 'reservation'">📅</span>
            <span v-else>🔔</span>
          </div>
          <div class="notification-content">
            <p class="notification-title">{{ notification.title }}</p>
            <p class="notification-message">{{ notification.message }}</p>
            <p class="notification-time">{{ notification.time }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SidebarMenu from '@/components/dashboard/SidebarMenu.vue';

export default defineComponent({
  name: 'NotificationsView',
  components: {
    SidebarMenu
  },
  data() {
    return {
      notifications: [
        {
          title: 'Novo Pedido',
          message: 'Mesa 5 fez um pedido',
          time: '10 minutos atrás',
          type: 'order',
          read: false
        },
        {
          title: 'Reserva Confirmada',
          message: 'João Silva reservou uma mesa para 4 às 19:30',
          time: '2 horas atrás',
          type: 'reservation',
          read: true
        },
        {
          title: 'Atualização do Sistema',
          message: 'Novos recursos disponíveis no painel',
          time: '1 dia atrás',
          type: 'system',
          read: true
        },
        {
          title: 'Pedido Pronto',
          message: 'Pedido #1234 está pronto para entrega',
          time: 'Agora mesmo',
          type: 'order',
          read: false
        }
      ]
    };
  }
});
</script>

<style scoped>
.dashboard-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.dashboard-content {
  flex: 1;
  padding: 2.5rem 2rem;
}

.notifications-list {
  margin-top: 20px;
}

.notification-item {
  display: flex;
  padding: 15px;
  border-radius: 8px;
  background: white;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.notification-item.unread {
  border-left: 4px solid #4f46e5;
}

.notification-icon {
  font-size: 24px;
  margin-right: 15px;
  color: #4f46e5;
}

.notification-content {
  flex: 1;
}

.notification-title {
  font-weight: 600;
  margin-bottom: 5px;
  color: #1e293b;
}

.notification-message {
  color: #64748b;
  margin-bottom: 5px;
}

.notification-time {
  font-size: 0.8rem;
  color: #94a3b8;
}
</style>
