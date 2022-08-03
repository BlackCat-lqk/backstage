<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card class="box-card">
        <el-row>
            <el-col>
                <el-button size="large" type="primary" @click="addRoleDialog=true">添加分类</el-button>
            </el-col>
            <el-col>
                <el-alert title="只能选中第三级" type="warning" show-icon :closable="false" />
            </el-col>
            <el-col>
                <div class="example-block">
                    <span class="example-demonstration">选择商品分类</span>
                    <el-cascader :props="cateProps" v-model="selectedCateKeys" :options="categoriesList" @change="handleChange" />
                </div>
            </el-col>
            <el-col>
                <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleTabClick">
                    <el-tab-pane label="动态参数" name="first">
                        <!-- 动态参数面板 -->
                        <el-button :disabled="isBtnDisabel" size="large" type="primary">添加参数</el-button>
                    </el-tab-pane>
                    <el-tab-pane label="静态属性" name="second">
                        <!-- 静态属性面板 -->
                        <el-button :disabled="isBtnDisabel" size="large" type="primary">添加属性</el-button>
                    </el-tab-pane>
                </el-tabs>
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
                // 级联选择框配置对象
                cateProps:{
                    expandTrigger: 'hover',
                    value:'cat_id',
                    label:'cat_name',
                    children:'children',
                },
                // 级联选择框双向绑定的值
                selectedCateKeys:[],
                // 被激活的标签页名称
                activeName:'first',
            }
        },
        created() {
            this.getCategoriesList()
        },
        computed:{
            // 如歌按钮需要被禁用则返回true,否则返回false
            isBtnDisabel(){
                if(this.selectedCateKeys.length != 3){
                    return true
                }else{
                    return false
                }
            },
        },
        methods: {
            // 获取商品分类列表
            async getCategoriesList(){
                const res = await categories.categoriesListApi()
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.categoriesList = res.data
            },
            // 级联选择框选中项变化监听
            handleChange(){
                // 证明选中的不是三级分类
                if(this.selectedCateKeys.length != 3){
                    this.selectedCateKeys = []
                }
            },
            // 页签点击激活事件
            handleTabClick(){

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