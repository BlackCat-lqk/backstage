import menulist from '../request.js'

const menuListApi = (data) => {
    return menulist.get({
        url:'/menus',
        data:data
    })
}

export default menuListApi