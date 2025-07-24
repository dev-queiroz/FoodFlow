<template>
  <div class="metric-card">
    <div class="metric-title">{{ title }}</div>
    <div class="metric-value">{{ value }}</div>
    <div v-if="subtitle" class="metric-subtitle">{{ subtitle }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  name: 'MetricCard',
  props: {
    title: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    subtitle: {
      type: String,
      required: false
    }
  }
});
</script>

<style scoped>
.metric-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  padding: 1.5rem 1.2rem;
  min-width: 170px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 1.2rem;
  transition: box-shadow 0.2s;
}
.metric-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.09);
}
.metric-title {
  font-size: 1.1rem;
  color: #555;
  margin-bottom: 0.5rem;
}
.metric-value {
  font-size: 2.1rem;
  font-weight: 700;
  color: #1a7f37;
}
.metric-subtitle {
  margin-top: 0.3rem;
  font-size: 0.95rem;
  color: #888;
}
</style>
