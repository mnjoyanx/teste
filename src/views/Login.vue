<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useFetch } from '@/composable/useFetch';
import { notification } from 'ant-design-vue';
import { LoadingOutlined } from '@ant-design/icons-vue';

const [api, contextHolder] = notification.useNotification();

const router = useRouter();

const { loading, add } = useFetch('/auth/login');

const formState = reactive({
  username: '',
  password: ''
});

const onFinish = (values) => {
  add(values)
    .then((res) => {
      localStorage.setItem('token', res.token);

      router.push('/');
    })
    .catch((err) => {
      api.error({
        message: 'Error',
        description: err.message
      });

      router.push('/');
    });
};

const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};
</script>

<template>
  <div class="login-form">
    <contextHolder />
    <h1 class="title">Sign in</h1>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input v-model:value="formState.username" />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password v-model:value="formState.password" />
      </a-form-item>

      <a-form-item class="submit-button_parent">
        <a-button type="primary" html-type="submit" :loading="loading"> Sign in </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<style lang="scss" scoped>
.title {
  text-align: center;
  margin-bottom: 40px;
}
.login-form {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
  padding-top: 100px;
}

.submit-button_parent {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
