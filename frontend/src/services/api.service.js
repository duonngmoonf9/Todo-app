import axios from "./axios.customer";
// Task
const apiGetTask = (dateQuery) => {
    const URL_BACKEND = `/api/tasks?filter=${dateQuery}`;
    return axios.get(URL_BACKEND);
}
const apiCreateTask = (data) => {
    const URL_BACKEND = "/api/tasks/create";
    return axios.post(URL_BACKEND, data);
}
const apiUpdateTask = (data, id) => {
    const URL_BACKEND = "/api/tasks/update/" + id;
    return axios.put(URL_BACKEND, data);
}
const apiDeleteOutcome = (id) => {
    const URL_BACKEND = "/api/tasks/delete/" + id;
    return axios.delete(URL_BACKEND);
}

export { apiCreateTask, apiDeleteOutcome, apiGetTask, apiUpdateTask };

//