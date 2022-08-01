import login from '../request.js'

const loginApi = (data) => {
    return login.post({
        url:'/login',
        data:data
    })
}

export default loginApi