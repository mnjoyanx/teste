<script setup>
import { ref, watch } from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { useFetch } from "@/composable/useFetch";
import { ApiHost } from "../../../globalConfigs";

const props = defineProps({
    file: {
        type: String,
        default: "",
    },
});

const emit = defineEmits(["handleUpload", "removeFile"]);

const { removeImage } = useFetch("file");

const previewVisible = ref(false);
const previewImage = ref("");
const previewTitle = ref("");
const fileList = ref([]);
const token = localStorage.getItem("token");

const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};

const handleCancel = () => {
    previewVisible.value = false;
    previewTitle.value = "";
};

const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
    previewTitle.value = file.name || file.url.substring(file.url.lastIndexOf("/") + 1);
};

const handleChange = (info) => {
    if (info.file.status === "removed") {
        fileList.value = [];
        emit("removeFile");
        removeImage(props.file);
        return;
    }

    const responsePath = info.file.response?.path;

    fileList.value = [info.file];

    if (responsePath) {
        emit("handleUpload", responsePath);
    }
};

watch(
    () => props.file,
    (value) => {
        if (value) {
            fileList.value = [
                {
                    uid: "-1",
                    name: "image.png",
                    status: "done",
                    url: value,
                },
            ];
        } else {
            fileList.value = [];
        }
    },
    {
        immediate: true,
    }
);
</script>

<template>
    <div class="clearfix">
        <a-upload
            v-model:file-list="fileList"
            list-type="picture-card"
            @preview="handlePreview"
            @change="handleChange"
            :action="ApiHost + '/file'"
            :headers="{
                Authorization: 'Bearer ' + token,
            }"
        >
            <div v-if="fileList.length < 2">
                <plus-outlined />
                <div style="margin-top: 8px">Upload</div>
            </div>
        </a-upload>
        <a-modal :open="previewVisible" :title="previewTitle" :footer="null" @cancel="handleCancel">
            <img alt="example" style="width: 100%" :src="previewImage" />
        </a-modal>
    </div>
</template>

<style scoped>
.ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
}
</style>
