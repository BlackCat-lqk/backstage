<template>
    <div>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
    import {defineComponent} from 'vue'
    export default defineComponent({
        data() {
            return {
                
            }
        },
        created() {
            
        },
        methods: {
            // 退出登录功能
            logout(){
                // 移除token 并编程式导航到登录页
                window.sessionStorage.removeItem('token')
                this.$router.push('/login')
            }
        },
    })
</script>

<style lang="less" scoped>

</style>