<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card class="box-card">
        <el-row>
            <el-col :span="12"><div class="grid-content ep-bg-purple" />
                <el-input v-model="input" clearable @clear="getOrdersList" placeholder="请输入关键字搜索">
                    <template #append>
                        <el-button icon="Search" @click="getOrdersList" />
                    </template>
                </el-input>
            </el-col>
            <el-col>
                <!-- 订单列表 -->
                <el-table border stripe :data="getOrderDataList">
                    <el-table-column label="订单编号" prop="order_number"></el-table-column>
                    <el-table-column label="价格" prop="order_price"></el-table-column>
                    <el-table-column label="是否付款" prop="order_pay"></el-table-column>
                    <el-table-column label="是否发货" prop="is_send"></el-table-column>
                    <el-table-column label="下单时间">
                        <template #default="scope">
                        <!-- 过滤器处理时间 -->
                            {{dataFormat(scope.row.create_time)}}
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="">
                            <el-button type="primary" icon="Edit" @click="pay()">付款</el-button>
                            <!-- 删除用户 -->
                            <el-button type="danger" icon="Delete">定位</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import { ElMessage } from 'element-plus'
import {defineComponent} from 'vue'
import order from '../http/api/order.js'
export default defineComponent({
    data() {
        return {
            // 订单搜索值
            input:'',
            // 订单列表数据
            getOrderDataList:[],
            // 请求订单列表的参数
            orderQuery:{
                pagenum:1,
                pagesize:5,
            },
            // 总数据数
            total:0,
        }
    },
    computed:{
    },
    created() {
        this.getOrdersList()
    },
    methods: {
        // 获取订单列表数据
        async getOrdersList(){
            const res = await order.getOrdersDataApi(this.orderQuery)
            if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
            this.getOrderDataList = res.data.goods
            this.total = res.data.total

        },
        pay(){
            
        },
        // 时间计算属性
        dataFormat(originval){
            const dt = new Date(originval)
            const y =  dt.getFullYear()
            const m = (dt.getMonth() +1 +'').padStart(2,0)
            const d = (dt.getDate() +'').padStart(2,0)
            const createTime = `${y}-${m}-${d}`
            return createTime

        },
    },
})
</script>

<style lang="less" scoped>
     .box-card{
        margin: 20px 0;
        
    }
    .el-table{
        margin: 20px 0;
        font-size: 14px;
    }
    .btn-opration{
        display: flex;
        justify-content: center;
    }
    .el-pagination{
        justify-content: center;
    }
    .el-col-one{
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>