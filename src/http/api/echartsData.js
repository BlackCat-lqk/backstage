import echarts from '../request.js'

// 商品分类数据列表
const echartsDataShowApi = (data) => {
    return echarts.get({
        url:'/reports/type/1',
        data:data
    })
}

export default{
    echartsDataShowApi,
}