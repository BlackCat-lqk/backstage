import roles from '../request.js'

// 获取角色列表接口
const getRolesList = (data) => {
    return roles.get({
        url:'/roles',
        data:data
    })
}

// 添加角色接口
const addRolesApi = (data) => {
    return roles.post({
        url:'/roles',
        data:data
    })
}

// 删除一个角色
const deleteRoleInfoApi = (data) => {
    return roles.deleteRequest({
        url:data,
        data:''
    })
}

// 根据角色id获取该角色信息
const getRoleInfoApi = (data) => {
    return roles.get({
        url:data,
        data:''
    })
}

// 修改角色信息
const editRoleInfoApi = (data) => {
    return roles.put({
        url:`/roles/${data.roleId}`,
        data:{
            roleName:data.roleName,
            roleDesc:data.roleDesc
        }
    })
}

// 删除角色指定权限
const deleteEvelAuthority = (data) => {
    return roles.deleteRequest({
        url:data,
        data:''
    })
}

// 角色授权
const roleAuthorizeApi = (urlData, data) => {
    return roles.post({
        url:urlData,
        data:data
    })
}

export default{
    getRolesList,
    addRolesApi,
    deleteRoleInfoApi,
    getRoleInfoApi,
    editRoleInfoApi,
    deleteEvelAuthority,
    roleAuthorizeApi
}