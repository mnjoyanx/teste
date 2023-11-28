import axios from "axios";
import { ApiHost } from "../../globalConfigs";

axios.defaults.baseURL = ApiHost;

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const authorizationToken = token ? `Bearer ${token}` : "";
    config.headers.Authorization = authorizationToken;
    return config;
});

export default axios;
