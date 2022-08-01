import permissions from '../request.js'

// 获取权限列表接口
const getPermissionsList = (data) => {
    return permissions.get({
        url:data,
        data:''
    })
}

export default{
    getPermissionsList,
}