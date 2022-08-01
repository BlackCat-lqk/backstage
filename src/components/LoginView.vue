<template>
    <div class="login_container">
        <div class="squre">
            <div class="cricle"></div>
            <el-form
             :model="loginForm" 
             label-width="0px" 
             class="login_box"
             ref="loginFormRef"
             :rules="loginFormRules"
             >
                <!-- 输入框区域 -->
                <el-form-item prop="username">
                    <el-input v-model="loginForm.username" prefix-icon="Avatar" class="w-50 m-2" size="large" placeholder="请输入用户名"/>
                </el-form-item> 
                <el-form-item prop="password">
                    <el-input v-model="loginForm.password" type="password" prefix-icon="Lock" class="w-50 m-2" size="large" placeholder="请输入密码"/>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="restLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import { ElMessage } from 'element-plus'
    import {defineComponent} from 'vue'
    import loginApi from '../http/api/login.js'
    export default defineComponent({    
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm:{
                    username:'',
                    password:'',
                },
                // 表单的验证对象
                loginFormRules:{
                    // 校验用户名是否合法
                    username:[
                        { required: true, message: '请输入合法用户名', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                    // 校验密码是否合法
                    password:[
                        { required: true, message: '请输入合法密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度应在3-10位之间', trigger: 'blur' },
                    ]
                }
            }
        },
        methods: {
            // 登录重置表单
            restLoginForm(){
                this.$refs.loginFormRef.resetFields()
            },
            // 登录
            login(){
                // 登录前验证
                this.$refs.loginFormRef.validate(async(vali)=>{
                    if(!vali) return
                    try {
                        const res = await loginApi(this.loginForm)
                        if(res.meta.status != 200){
                        ElMessage.error(res.meta.msg)
                    }else{
                        ElMessage.success(res.meta.msg)
                        // 1.登录成功后将token保存在sessionStroge中
                        window.sessionStorage.setItem('token', res.data.token)
                        // 2.编程式导航跳转到页面
                        this.$router.push('/home')
                        // 3.路由守卫控制权限
                    }
                    } catch (error) {
                        ElMessage.error('请求服务失败')
                    }
                })
            }
        },
    })
</script>

<style lang="less" scoped>
    .login_container{
        background-color: #2b4b6b;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        .squre{
            width: 600px;
            height: 450px;
            background-color: #fff;
            box-shadow: 0 0 5px 5px rgb(192, 185, 185);
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            .cricle{
                position: absolute;
                width: 200px;
                height: 200px;
                border-radius: 50%;
                background-color:#999;
                background-image: url(../assets/logo.png);
                background-position: center center;
                border: 20px solid #fff;
                box-shadow: 0 0 5px 5px rgb(192, 185, 185);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -150%);
            }
            .login_box{
                width: 100%;
                padding: 100px 10px 0 10px;
                .el-input{
                    height: 50px;
                }
            }
        }
        .btns{
            :deep(.el-form-item__content){
                display: flex;
                justify-content: flex-end;
            }
            .el-button{
                height: 50px;
                width: 70px;
            }
        }
    }
</style>