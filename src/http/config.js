import axios from 'axios'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 封装axios
const Server = axios.create({
    baseURL:'http://127.0.0.1:8888/api/private/v1',
    headers:{
        'Content-Type':'application/json; charset=utf-8'
    },
    timeout:10000,
})

// 请求拦截器
Server.interceptors.request.use((config)=>{
    NProgress.start()
    // 每次请求前都将token带到Authorization里面去,保证拥有获取数据的权限
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
})

// 响应拦截器
Server.interceptors.response.use((response) => {
    // 获取接口返回结果
    const res = response.data
    NProgress.done()
    return res
})

export default Server