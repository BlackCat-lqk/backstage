import orders from '../request.js'

const getOrdersDataApi = (data) => {
    return orders.get({
        url:'/orders',
        data:data
    })
}

export default {
    getOrdersDataApi
}