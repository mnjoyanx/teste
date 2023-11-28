<script setup>
const emit = defineEmits(["confirm"]);

const handleClick = (param) => {
    console.log(param);
    emit("confirm", param);
};
</script>

<template>
    <div class="confirm-main">
        <h2 class="title">Are you sure you want to delete this item?</h2>
        <div class="actions-parent">
            <a-button type="primary" class="yes-button" @click="handleClick(true)"> Yes </a-button>
            <a-button type="default" danger class="no-button" @click="handleClick(false)">
                No
            </a-button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.title {
    margin-bottom: 20px;
}

.actions-parent {
    display: flex;
    justify-content: flex-end;
    padding-top: 20px;
}

.yes-button {
    margin-right: 10px;
}
</style>
