import axios from "axios";
const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development" ? "http://localhost:3000/" : "/",
  timeout: 30000,
});

export default axiosInstance;
