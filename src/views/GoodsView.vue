<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card class="box-card">
        <el-row>
            <el-col>
                <el-button size="large" type="primary" @click="addShop">添加商品</el-button>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import {defineComponent} from 'vue'
    export default defineComponent({
        data() {
            return {
                
            }
        },
        methods: {
            addShop(){
                this.$router.push('/goods/add')
            }
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