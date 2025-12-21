import axios from "axios";
import Swal from "sweetalert2";

const api = axios.create({
    baseURL : "https://www.reihan.biz.id/api/v1",
})


api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem("token");

            Swal.fire({
                icon : "warning",
                title : "Session Expired",
                text  :"Token Kamu Sudah habis, Silahkan Login Ulang",
                confirmButtonText : "login",
            }).then(() => {
                window.location.href = "/login";
            })
        }
        return Promise.reject(err);
    }
)

export default api;