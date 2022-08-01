<template>
    <div class="common-layout">
        <el-container class="home-container">
            <!-- 头部区域 -->
            <el-header>
                <div class="header-logo">
                    <img src="../assets/logo.png" alt="logo" srcset="">
                    <span>后台管理</span>
                </div>
                <el-button type="info" @click="logout">退出登录</el-button>
            </el-header>
            <!-- 页面主体区域 -->
            <el-container>
                <!-- 侧边栏  -->
                <el-aside :width="isCollapse ? '64px' : '200px'">
                    <!-- 折叠收起 -->
                    <div class="show-hide" @click="toggleCollapse">
                        <el-icon v-if="isCollapse==false"><DArrowLeft /></el-icon>
                        <el-icon v-if="isCollapse==true"><DArrowRight /></el-icon>
                    </div>
                    <el-menu
                        :default-active="activePath"
                        class="el-menu-vertical-demo"
                        background-color="#333744"
                        text-color="#fff"
                        unique-opened
                        :collapse="isCollapse"
                        :collapse-transition="false"
                        router
                    >   
                        <!-- 一级菜单 -->
                        <el-sub-menu v-for="(item) in menulist" :index="item.id + ''" :key="item.id">
                            <!-- 一级菜单的模板区域 -->
                            <template #title>
                                <!-- 图标 -->
                                <el-icon><location /></el-icon>
                                <!-- 文本 -->
                                <span>{{item.authName}}</span>
                            </template>
                            <!-- 二级菜单 -->
                            <el-menu-item :index="'/'+item2.path" v-for="(item2) in item.children" :key="item2.id">
                            <template #title>
                                <!-- 图标 -->
                                <el-icon><location /></el-icon>
                                <!-- 文本 -->
                                <span @click="saveActivePath('/'+item2.path)">{{item2.authName}}</span>
                            </template>
                            </el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <!-- 右侧内容主体 -->
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import { ElMessage } from 'element-plus'
    import {defineComponent} from 'vue'
    import menuListApi from '../http/api/menulist.js'
    export default defineComponent({
        data() {
            return {
                // 左侧菜单数据
                menulist:[],
                // 是否折叠菜单
                isCollapse:false,
                // 默认激活的菜单链接
                activePath:'/users',
            }
        },
        created() {
            this.getMenuList()
            window.sessionStorage.getItem('activePath') ? this.activePath = window.sessionStorage.getItem('activePath') : this.activePath
        },
        methods: {
            // 退出登录功能
            logout(){
                // 移除token 并编程式导航到登录页
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            },
            async getMenuList(){
                const res = await menuListApi()
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.menulist = res.data
            },
            toggleCollapse(){
                this.isCollapse = !this.isCollapse
            },
            saveActivePath(path){
                window.sessionStorage.setItem('activePath', path)
            }
        },
    })
</script>

<style lang="less" scoped>
    .common-layout,.home-container{
        height: 100%;
    }
    .el-header{
        background-color: #373b41;
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #fff;
        .header-logo{
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                height: 90%;
                padding: 10px;
            }
        }
    }
    .el-aside{
        background-color: #333744;
        .el-menu{
            border-right: 0;
        }
        .show-hide{
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #999;
            cursor: pointer;
            color: #fff;
        }
    }
    .el-main{
        background-color: #eaebf1;
    }
</style>