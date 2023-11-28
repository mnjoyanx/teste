<script setup>
import { onMounted } from 'vue';
import { useGlobalStore } from '@/store/global';
import { storeToRefs } from 'pinia';
import { RouterView, useRouter } from 'vue-router';
import { useFetch } from '@/composable/useFetch';
import { ref } from 'vue';
import { ConfigProvider } from 'ant-design-vue';

const router = useRouter();

const { checkToken } = useFetch('auth/validate');

const store = useGlobalStore();
const { primaryColor } = storeToRefs(store);

const layout = ref('AuthLayout');

onMounted(() => {
  const token = localStorage.getItem('token');

  primaryColor.value = localStorage.getItem('primaryColor') || '#00A76F';

  if (token) {
    checkToken(token)
      .then(() => {
        layout.value = 'MainLayout';
      })
      .catch(() => {
        localStorage.removeItem('token');
        layout.value = 'AuthLayout';
        router.push({ name: 'login' });
      });
  }
});
</script>

<template>
  <div>
    <config-provider
      :theme="{
        token: { colorPrimary: primaryColor }
      }"
    >
      <component :is="layout"> <router-view /> </component>
    </config-provider>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  height: 100vh;
}
</style>
