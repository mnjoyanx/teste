import axios from "./axios";

export const request = (method, url, body = {}, params) => {
    if (method === "get") {
        body.params = {
            query: params,
        };
    }

    return axios[method](url, body)
        .then((res) => {
            return res.data;
        })
        .catch((err) => {
            throw err;
        });
};
