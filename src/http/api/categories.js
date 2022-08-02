import categories from '../request.js'

// 商品分类数据列表
const categoriesListApi = (data) => {
    return categories.get({
        url:'/categories',
        data:data
    })
}

export default{
    categoriesListApi,
}