import login from '../request.js'

const loginApi = (data) => {
    return login.post({
        url:'/api/private/v1/login',
        data:data
    })
}

export default loginApi