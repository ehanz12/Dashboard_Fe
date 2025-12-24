import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

export const clearAccessToken = () => {
  accessToken = null;
};

const api = axios.create({
  baseURL: "https://www.reihan.biz.id/api/v1",
  withCredentials: true, // refresh token via cookie
});

api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    // ⛔ JANGAN REFRESH JIKA REQUEST ITU SENDIRI ADALAH REFRESH
    if (
      err.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        const newToken = res.data.access_token;

        setAccessToken(newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        return api(originalRequest);
      } catch {
        clearAccessToken();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);


export default api;
