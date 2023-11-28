<script setup>
import { ref, reactive, watch, onMounted } from "vue";
import { useGlobalStore } from "@/store/global";
import { Form } from "ant-design-vue";

;

const useForm = Form.useForm;

const props = defineProps({
    data: {
        type: Object,
        default: () => ({}),
    },

    type: {
        type: String,
        default: "add",
    },
});

const emit = defineEmits(["submit"]);

const store = useGlobalStore();

const { toggleDrawer } = store;

const form = reactive({"ascasc":""});
const rules = reactive({"ascasc":[{"required":true,"message":"Please enter ascasc!"}]});

const isDisabled = ref(false);

const { resetFields } = useForm(form);

;

;

const onClose = () => {
    toggleDrawer();
};

const onSubmit = () => {
    toggleDrawer();
    emit("submit", form);
    resetFields();
};

watch(
    () => form,
    (value) => {
        isDisabled.value = Object.values(value).some((item) => item === "");
    },
    {
        deep: true,
        immediate: true,
    }
);

watch(
    () => [props.data.value, props.type],
    (value) => {
        const formItems = value[0];

        if (value[1] == "add") {
            for (let key in form) {
                form[key] = "";
            }
        } else {
            for (let key in form) {
                form[key] = formItems[key];
            }
        }
    },
    {
        immediate: true,
    }
);

onMounted(() => {
    if (props.type == "add") {
        isDisabled.value = true;
    } else {
        isDisabled.value = false;
    }
});
</script>

<template>
    <div>
        <a-form :model="form" layout="vertical">
            <a-row :gutter="16">
                <a-col :span="24"> 
        <a-form-item label="ASCASC" name="ascasc" :rules="rules.ascasc">
          
        <a-input v-model:value="form.ascasc" />
      
      </a-form-item>
        </a-col>
            </a-row>
        </a-form>
        <a-space>
            <a-button @click="onClose">Cancel</a-button>
            <a-button type="primary" @click="onSubmit" :disabled="isDisabled">Submit</a-button>
        </a-space>
    </div>
</template>

<style scoped>
.avatar-uploader {
    position: relative;
    overflow: hidden;
    width: 102px;
    height: 102px;
    border-radius: 5px;
}
.preview-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 102px;
    height: 102px;
}
</style>
