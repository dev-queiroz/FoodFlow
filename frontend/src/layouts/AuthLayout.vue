<template>
  <div class="auth-layout">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'AuthLayout',
});
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  width: 100%;
}
</style>
