<script setup>
import { useFetch } from '@/composable/useFetch';

const { data } = useFetch('users/1');
</script>

<template>
  <a-card>
    <a-spin>
      <div>
        <h2>User name</h2>
        <p>email</p>
        <p>role</p>
      </div>
    </a-spin>
  </a-card>
</template>

<style scoped></style>
