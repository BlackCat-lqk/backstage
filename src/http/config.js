import axios from 'axios'

// 封装axios
const Server = axios.create({
    baseURL:'http://127.0.0.1:8888',
    headers:{
        'Content-Type':'application/json; charset=utf-8'
    },
    timeout:10000,
})

// 请求拦截器
Server.interceptors.request.use((config)=>{
    // 每次请求前都将token带到athritor里面去
    
    return config
})


// 响应拦截器
Server.interceptors.response.use((response) => {
    // 获取接口返回结果
    const res = response.data
    return res
})

export default Server