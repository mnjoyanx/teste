import { request } from "./request";

export const getData = (url, query) => {
    return request("get", url, {}, query);
};

export const postData = (url, body) => {
    return request("post", url, body);
};

export const putData = (url, body) => {
    return request("put", url, body);
};

export const deleteData = (url, body) => {
    return request("delete", url, body);
};
