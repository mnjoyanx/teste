<script setup>
import Sidebar from '@/layout/Sidebar/index.vue';
import { MenuFoldOutlined, MenuUnfoldOutlined, SettingOutlined } from '@ant-design/icons-vue';
import SettingsDrawer from '@/components/common/SettingsDrawer.vue';
import AppSettings from '@/components/common/AppSettings.vue';
import { useGlobalStore } from '@/store/global';
import { ref } from 'vue';

const store = useGlobalStore();
const { toggleSettingsDrawer } = store;

const collapsed = ref(false);
</script>

<template>
  <div>
    <settings-drawer title="Settings">
      <app-settings />
    </settings-drawer>

    <div class="wrapper">
      <Sidebar :collapsed="collapsed" />
      <div class="content-wrapper">
        <a-layout>
          <a-layout-header style="padding: 20px">
            <div class="header-settings_wrapper">
              <menu-unfold-outlined
                style="color: #fff"
                class="trigger"
                v-if="collapsed"
                @click="collapsed = !collapsed"
              />
              <menu-fold-outlined
                style="color: #fff"
                v-else
                class="trigger"
                @click="collapsed = !collapsed"
              />

              <div class="settings-item" @click="toggleSettingsDrawer">
                <setting-outlined style="color: #fff" />
              </div>
            </div>
          </a-layout-header>
        </a-layout>
        <a-layout-content style="padding: 0 20px">
          <a-breadcrumb style="margin: 20px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>
              {{ $route.name }}
            </a-breadcrumb-item>
          </a-breadcrumb>
          <div class="content-main">
            <RouterView />
          </div>
        </a-layout-content>
      </div>
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  height: 100vh;
  background: #f0f2f5;
}

.content-wrapper {
  width: 100%;
}

.content-main {
  background: #fff;
  padding: 24px;
}

.a-layout-header {
  width: 100%;
  height: 50px;
  background-color: #001529;
  display: flex;
  align-items: center;
}

.trigger {
  font-size: 18px;
  cursor: pointer;
  transition: color 0.3s;
  margin: 0 !important;
}

.settings-item {
  cursor: pointer;
}

.header-settings_wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
