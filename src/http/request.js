import Server from './config.js'

// 封装get请求
const get = (config) => {
    return Server(
        {
            ...config,
            method:'get',
            params:config.data
        }
    )
}

// 封装post请求
const post = (config) => {
    return Server(
        {
            ...config,
            method:'post',
            data:config.data
        }
    )
}

// 封装put请求
const put = (config) => {
    return Server(
        {
            ...config,
            method:'put',
            data:config.data
        }
    )
}

// 封装delete请求
const deleteRequest = (config) => {
    return Server(
        {
            ...config,
            method:'delete',
            data:config.data
        }
    )
}

export default{
    get,
    post,
    put,
    deleteRequest,
}