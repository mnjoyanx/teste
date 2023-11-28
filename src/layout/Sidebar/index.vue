<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import logo from '@/assets/images/logo.png'

import {
  MenuFoldOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined
} from '@ant-design/icons-vue'

defineProps({
  collapsed: Boolean
})

const router = useRouter()

const selectedKeys = ref([])
const menuItems = ref([
  { name: 'TABLE_3', link: '/table_3' },
  { name: 'TABLE_5', link: '/table_5' }
])

watch(
  () => router.currentRoute.value.path,
  (path) => {
    const item = menuItems.value.find((item) => item.link === path)
    if (item) {
      selectedKeys.value = [item]
    }
  },
  { immediate: true }
)

function handleLogout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <a-layout>
    <a-layout-sider :collapsed="collapsed" :trigger="null" collapsible>
      <div class="logo">
        <img :src="logo" alt="logo" />
      </div>

      <a-menu :selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item v-for="item in menuItems" :key="item">
          <template v-if="collapsed">
            <router-link :to="item.link">
              <span>{{ item.name[0].toUpperCase() }}</span>
            </router-link>
          </template>
          <template v-else>
            <span>
              <router-link :to="item.link">{{ item.name }}</router-link>
            </span>
          </template>
        </a-menu-item>
      </a-menu>
      <div class="logout-item" @click="handleLogout">
        <template v-if="collapsed">
          <logout-outlined />
        </template>
        <template v-else>
          <logout-outlined />
          Logout
        </template>
      </div>
    </a-layout-sider>
  </a-layout>
</template>
<style scoped lang="scss">
.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  margin: 16px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.site-layout .site-layout-background {
  background: #fff;
}

.logout-item {
  position: absolute;
  bottom: 30px;
  left: 0;
  padding-left: 24px;
  margin: 4px;
  color: #a6adb5;
  transition: color 0.3s;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
}
</style>
