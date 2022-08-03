<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card class="box-card">
        <el-row>
            <el-col>
                <el-button size="large" type="primary" @click="addRoleDialog=true">添加分类</el-button>
            </el-col>
            <el-col>
                
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
    import { ElMessage } from 'element-plus'
    import {defineComponent} from 'vue'
    import categories from '../http/api/categories.js'
    export default defineComponent({
        data() {
            return {
                // 返回的商品分类数据
                categoriesList:[],
                // 请求商品分类列表的参数
                categoriesQurey:{
                    type:3,
                    pagenum:1,
                    pagesize:5,
                },
                // 总数据条数
                total:0,
            }
        },
        created() {
            this.getCategoriesList()
        },
        methods: {
            // 获取商品分类列表
            async getCategoriesList(){
                const res = await categories.categoriesListApi()
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.categoriesList = res.data
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