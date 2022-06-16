import axios from "axios";

const selectToken = () => {
  const sessionToken = window.sessionStorage.userObj
    ? JSON.parse(window.sessionStorage.userObj)?.sessionToken
    : "";
  const token = localStorage.getItem("token");
  if (sessionToken && sessionToken !== token) {
    return sessionToken;
  }
  return token;
};

const axiosInstance = () => {
  const defaultOptions = {
    baseURL: `${process.env.REACT_APP_BACKEND}:${process.env.REACT_APP_BACKEND_PORT}`,
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const instance = axios.create(defaultOptions);

  instance.interceptors.request.use((config) => {
    const token = selectToken();
    if (
      !(config.url.includes("login") || config.url.includes("users/password"))
    ) {
      config.headers.Authorization = token ? `Token ${token}` : "";
    }
    return config;
  });

  instance.interceptors.response.use(undefined, (error) => {
    const { status, config } = error.response;

    if (
      !config?.url.includes("update_password") &&
      (status === 403 || status === 401)
    ) {
      window.sessionStorage.removeItem("userObj");
      localStorage.removeItem("userObj");
      window.location.href = "/";
    }

    return Promise.reject(error);
  });

  return instance;
};

export default axiosInstance();
