import axios from "axios"

if (!process.env.REACT_APP_BACKEND_SERVER) throw new Error("not found base url")
axios.defaults.baseURL = process.env.REACT_APP_BACKEND_SERVER
axios.defaults.timeout = 5000 // 设置这么短之后调试就要注意了，都会超时的

const $http = axios
export { $http }
export default axios
