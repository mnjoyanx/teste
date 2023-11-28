import { ref } from "vue";
import { getData, postData, putData, deleteData } from "../api/methods.js";

export function useFetch(url) {
    const data = ref(null);
    const error = ref(null);
    const loading = ref(false);

    function get(queryParams) {
        loading.value = true;

        return new Promise((resolve, reject) => {
            queryParams = JSON.stringify(queryParams);
            getData(url + "/getter", queryParams)
                .then((res) => {
                    loading.value = false;
                    data.value = res;
                    resolve(res);
                })
                .catch((err) => {
                    error.value = err;
                    loading.value = false;
                    reject(err);
                });
        });
    }

    function add(body) {
        loading.value = true;
        return new Promise((resolve, reject) => {
            postData(url, body)
                .then((res) => {
                    data.value = res;
                    loading.value = false;
                    resolve(res);
                })
                .catch((err) => {
                    error.value = err;
                    loading.value = false;
                    reject(err);
                });
        });
    }

    function put(body) {
        loading.value = true;
        return new Promise((resolve, reject) => {
            const reqUrl = url + "/" + body.id;
            delete body.id;

            putData(reqUrl, body)
                .then((res) => {
                    data.value = res;
                    loading.value = false;
                    resolve(res);
                })
                .catch((err) => {
                    error.value = err;
                    loading.value = false;
                    reject(err);
                });
        });
    }

    function remove(id) {
        loading.value = true;
        return new Promise((resolve, reject) => {
            deleteData(url + "/many", { data: { ids: id } })
                .then((res) => {
                    data.value = res;
                    loading.value = false;
                    resolve(res);
                })
                .catch((err) => {
                    error.value = err;
                    loading.value = false;
                    reject(err);
                });

            loading.value = false;
        });
    }

    function removeImage(path) {
        loading.value = true;
        return new Promise((resolve, reject) => {
            deleteData(url, { data: { path } })
                .then((res) => {
                    data.value = res;
                    loading.value = false;
                    resolve(res);
                })
                .catch((err) => {
                    error.value = err;
                    loading.value = false;
                    reject(err);
                });

            loading.value = false;
        });
    }

    function checkToken() {
        const token = localStorage.getItem("token");

        return new Promise((resolve, reject) => {
            postData(url, { token })
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    return {
        data,
        error,
        loading,
        get,
        add,
        put,
        remove,
        removeImage,
        checkToken,
    };
}
