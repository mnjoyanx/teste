<script setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";

import { useGlobalStore } from "../../store/global";

const store = useGlobalStore();

const { isModalOpen } = storeToRefs(store);

const { toggleModal } = store;

const handleOk = (e) => {
    toggleModal();
};
</script>

<template>
    <div>
        <a-modal v-model:open="isModalOpen" class="modal-wrapper">
            <slot></slot>
        </a-modal>
    </div>
</template>

<style>
.modal-wrapper .ant-btn-primary:not(.no-button, .yes-button),
.modal-wrapper .ant-btn-default:not(.no-button, .yes-button) {
    display: none;
}
</style>
