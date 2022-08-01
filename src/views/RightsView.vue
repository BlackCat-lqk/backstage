<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片列表 -->
        <el-card class="box-card">
            <el-table :data="permissionsList" stripe border size="large">
                <el-table-column type="index" label="序号" width="70px"/>
                <el-table-column prop="authName" label="权限名称"/>
                <el-table-column prop="path" label="路径"/>
                <el-table-column label="权限等级">
                    <template #default="scope">
                        <div>
                            <el-tag size="large" v-if="scope.row.level==0">一级</el-tag>
                            <el-tag size="large" v-else-if="scope.row.level==1" class="ml-2" type="warning">二级</el-tag>
                            <el-tag size="large" v-else class="ml-2" type="danger">三级</el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
    import {defineComponent} from 'vue'
    import permissions from '../http/api/permissions_list.js'
    import { ElMessage } from 'element-plus'
    export default defineComponent({
        data() {
            return {
                // 权限列表
                permissionsList:[]
            }
        },
        created() {
            this.getPermissionsList()
        },
        methods: {
            async getPermissionsList(){
                const res = await permissions.getPermissionsList(`/rights/list`)
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.permissionsList = res.data
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
</style>