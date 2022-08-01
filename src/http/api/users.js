import users from '../request.js'

// 获取用户列表接口
const usersApi = (data) => {
    return users.get({
        url:'/users',
        data:data
    })
}

// 修改用户状态接口
const usersStatusApi = (data) => {
    return users.put({
        url:data,
        data:''
    })
}

// 添加用户接口
const addUsersApi = (data) => {
    return users.post({
        url:'/users',
        data:data
    })
}

// 修改编辑用户
const editUsersApi = (data) => {
    return users.put({
        url:`/users/${data.id}`,
        data:{
            email:data.email,
            mobile:data.mobile
        }
    })
}

// 根据用户id查询用户信息
const userIdInfoApi = (data) => {
    return users.get({
        url:data,
        data:''
    })
}

// 根据用户id删除用户信息
const deleteUserInfoApi = (data) => {
    return users.deleteRequest({
        url:data,
        data:''
    })
}

// 分配用户角色
const distributeUserRoleApi = (urlData, data) => {
    return users.put({
        url:urlData,
        data:data
    })
}

export default {
    usersApi, 
    usersStatusApi,
    addUsersApi,
    editUsersApi,
    userIdInfoApi,
    deleteUserInfoApi,
    distributeUserRoleApi
}