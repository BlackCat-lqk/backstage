<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片列表 -->
        <el-card class="box-card">
            <el-row :gutter="20">
                <el-col :span="12"><div class="grid-content ep-bg-purple" />
                    <el-input v-model="queryUsersInfo.query" clearable @clear="getUsersList" placeholder="请输入关键字搜索">
                        <template #append>
                            <el-button icon="Search" @click="getUsersList" />
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="8"><div class="grid-content ep-bg-purple" />
                    <el-button type="primary" @click="addUserDialog">添加用户</el-button>
                    <!-- 添加用户对话框 -->
                    <el-dialog
                        v-model="addUserDialogVisible"
                        title="添加用户"
                        width="30%"
                    >
                        <el-form
                            ref="addUserFormRef"
                            :model="addUserRuleForm"
                            :rules="addUserRules"
                            label-width=""
                            class="demo-ruleForm"
                            status-icon
                        >
                            <el-form-item label="用户名" prop="username">
                            <el-input v-model="addUserRuleForm.username" />
                            </el-form-item>
                            <el-form-item label="密码" prop="password">
                            <el-input v-model="addUserRuleForm.password" />
                            </el-form-item>
                            <el-form-item label="邮箱" prop="email">
                            <el-input v-model="addUserRuleForm.email" />
                            </el-form-item>
                            <el-form-item label="手机号" prop="mobile">
                            <el-input v-model="addUserRuleForm.mobile" />
                            </el-form-item>
                        </el-form>
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="closeAddUserDialog">取消</el-button>
                            <el-button type="primary" @click="addUser">确认</el-button>
                        </span>
                        </template>
                    </el-dialog>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <el-table :data="userData" border stripe size="large" fit>
                <el-table-column type="index"/>
                <el-table-column prop="username" label="姓名"/>
                <el-table-column prop="email" label="邮箱"/>
                <el-table-column prop="mobile" label="电话"/>
                <el-table-column prop="role_name" label="角色"/>
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-switch
                            v-model="scope.row.mg_state"
                            class="ml-2"
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            @change="changeUserStatus(scope.row)"
                        />
                    </template>
                </el-table-column>
                <el-table-column  label="操作">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" @click="editUserDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除用户 -->
                        <el-button type="danger" icon="Delete" @click="deleteUserInfo(scope.row.id)">删除</el-button>
                        <!-- 更多 -->
                        <el-button type="warning" icon="More" @click="distributeRoleDialog(scope.row)">分配角色</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                v-model:currentPage="queryUsersInfo.pagenum"
                v-model:page-size="queryUsersInfo.pagesize"
                :page-sizes="[10, 20, 30, 40]"
                small="small"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
        </el-card>
        <!-- 修改用户信息对话框 -->
        <el-dialog
            v-model="editUserDialogVisible"
            title="编辑用户"
            width="30%"
        >
            <el-form
                ref="editUserFormRef"
                :model="editUserRuleForm"
                :rules="editUserRules"
                label-width=""
                class="demo-ruleForm"
                status-icon
            >
                <el-form-item label="用户名">
                <el-input disabled v-model="editGetUserName" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="editUserRuleForm.email" />
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                <el-input v-model="editUserRuleForm.mobile" />
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeEditUserDialog">取消</el-button>
                <el-button type="primary" @click="editUserInfo">确认</el-button>
            </span>
            </template>
        </el-dialog>
        <!-- 分配角色信息对话框 -->
        <el-dialog
            v-model="distributeDialogVisible"
            title="分配角色"
            width="30%"
        >
            <div>
                <span>当前的用户：{{currentUser}}</span>
            </div>
            <div>
                <span>当前的角色：{{currentRole}}</span>
            </div>
            <el-select v-model="reloeChangeId" class="m-2" placeholder="Select" size="large">
                <el-option
                v-for="item in distributeReloList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
                />
            </el-select>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="distributeDialogVisible=false">取消</el-button>
                <el-button type="primary" @click="distributeRoleCommit">确认</el-button>
            </span>
            </template>
        </el-dialog>
    </div>    
</template>

<script>
    import { ElMessage, ElMessageBox } from 'element-plus'
    import {defineComponent} from 'vue'
    import users from '../http/api/users.js'
    import roles from '../http/api/roles.js'
    
    export default defineComponent({
        data() {
            // 自定义验证邮箱的校验
            let checkEmail = (rule, value, cb) => {
                const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
                if(regEmail.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的邮箱'))
            }

            // 自定义验证手机号的校验
            let checkMobile = (rule, value, cb) => {
                const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
                if(regMobile.test(value)){
                    return cb()
                }
                cb(new Error('请输入合法的手机号'))
            }

            return {
                userData:[],
                // 查询用户列表参数
                queryUsersInfo:{
                    // 查询参数
                    query:'',
                    // 当前页码
                    pagenum:1,
                    // 每页显示条数
                    pagesize:10,
                },
                // 总条数
                total:0,
                // 是否显示添加用户对话框
                addUserDialogVisible:false,
                // 是否显示修改用户对话框
                editUserDialogVisible:false,
                // 添加用户的表单
                addUserRuleForm:{
                    username:'',
                    password:'',
                    email:'',
                    mobile:'',
                },
                // 修改用户的表单
                editUserRuleForm:{
                    id:'',
                    email:'',
                    mobile:'',
                },
                // 修改用户表单验证规则
                editUserRules:{
                    email:[
                        { required: true, message: '请输入合法的邮箱', trigger: 'blur' },
                        {validator:checkEmail, trigger:'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入合法的手机号', trigger: 'blur' },
                        {validator:checkMobile, trigger:'blur'}
                    ],
                },
                // 修改用户时获取的用户名
                editGetUserName:'',
                // 添加用户验证规则
                addUserRules:{
                    // 校验用户名是否合法
                    username:[
                        { required: true, message: '请输入合法用户名', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                    // 校验密码是否合法
                    password:[
                        { required: true, message: '请输入合法密码', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度应在3-10位之间', trigger: 'blur' },
                    ],
                    email:[
                        { required: true, message: '请输入合法的邮箱', trigger: 'blur' },
                        {validator:checkEmail, trigger:'blur'}
                    ],
                    mobile:[
                        { required: true, message: '请输入合法的手机号', trigger: 'blur' },
                        {validator:checkMobile, trigger:'blur'}
                    ],
                },
                // 是否显示分配角色对话框
                distributeDialogVisible:false,
                currentUser:'',
                currentRole:'',
                // 分配的角色选项
                distributeReloList:[],
                // 选中的角色id
                reloeChangeId:'',
                // 权限id
                userChangeId:'',
            }
        },
        created(){
           this.getUsersList()
        },
        methods: {
            // 获取用户列表
            async getUsersList(){
                const res = await users.usersApi(this.queryUsersInfo)
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.userData = res.data.users
                this.total = res.data.total
            },
            // 监听pagesize改变事件（改变每页显示数）
            handleSizeChange(value){
                this.queryUsersInfo.pagesize = value
                this.getUsersList()
            },
            // 监听页码值改变事件(改变当前页)
            handleCurrentChange(value){
                this.queryUsersInfo.pagenum = value
                this.getUsersList()
            },
            // 改变用户状态
            async changeUserStatus(row){
                const res = await users.usersStatusApi(`/users/${row.id}/state/${row.mg_state}`)
                if(res.meta.status != 200){
                    ElMessage.error(res.meta.msg)
                    row.mg_state = !row.mg_state
                }else{
                    ElMessage.success(res.meta.msg)
                }       
            },
            // 用户对话框
            addUserDialog(){
                this.addUserDialogVisible = true
            },
            // 添加用户的对话框重置表单和关闭
            closeAddUserDialog(){
                this.addUserDialogVisible = false
                this.$refs.addUserFormRef.resetFields()
            },
            // 添加用户
            addUser(){
                this.$refs.addUserFormRef.validate(async(vali)=>{
                    if(!vali) return ElMessage.error('请输入合法参数')
                    const res = await users.addUsersApi(this.addUserRuleForm)
                    if(res.meta.status != 201){
                        this.closeAddUserDialog()
                        return ElMessage.error(res.meta.msg)
                    }else{
                        this.getUsersList()
                        ElMessage.success(res.meta.msg)
                        this.closeAddUserDialog()
                    }
                })
            },
            // 修改用户对话框重置和关闭
            closeEditUserDialog(){
                this.$refs.editUserFormRef.resetFields()
                this.editUserDialogVisible = false
            },
            // 弹出修改用户信息对话框
            async editUserDialog(userId){
                this.editUserDialogVisible = true
                const res = await users.userIdInfoApi(`/users/${userId}`)
                if(res.meta.status != 200){
                     this.editUserDialogVisible = false
                    return ElMessage.error(res.meta.msg)
                }else{
                    this.editGetUserName = res.data.username
                    this.editUserRuleForm.email = res.data.email
                    this.editUserRuleForm.mobile = res.data.mobile
                    this.editUserRuleForm.id = res.data.id
                }
            },
            // 修改用户信息提交
            editUserInfo(){
                // 提交前验证表单
                this.$refs.editUserFormRef.validate(async(vali)=>{
                    if(!vali) return ElMessage.error('请输入合法参数')
                    const res = await users.editUsersApi(this.editUserRuleForm)
                    if(res.meta.status != 200){
                        this.closeEditUserDialog()
                        return ElMessage.error(res.meta.msg)
                    }else{
                        this.getUsersList()
                        ElMessage.success(res.meta.msg)
                        this.closeEditUserDialog()
                    }
                })
            },
            // 删除用户
            deleteUserInfo(id){
                ElMessageBox.confirm(
                    '将会永久删除一个用户，确认继续?',
                    '删除用户',
                    {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    }
                ).then( async() => {
                    const res = await users.deleteUserInfoApi(`/users/${id}`)
                    console.log(res)
                    if(res.meta.status != 200){
                        ElMessage({
                            type: 'error',
                            message: res.meta.msg,
                        })
                    }else{
                        ElMessage({
                            type: 'success',
                            message: res.meta.msg,
                        })
                        this.getUsersList()
                    }
                }).catch(() => {
                ElMessage({
                        type: 'error',
                        message: '删除失败',
                    })
                })      
            },
            // 分配角色对话框
            async distributeRoleDialog(row){
                this.currentRole = row.role_name
                this.currentUser = row.username
                this.distributeDialogVisible = true
                const res = await roles.getRolesList('')
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.distributeReloList = res.data
                this.userChangeId = row.id
            },
            // 确认提交分配角色
            async distributeRoleCommit(){
                if(!this.reloeChangeId) return ElMessage.error('请选择要分配的角色')
                const res = await users.distributeUserRoleApi(`/users/${this.userChangeId}/role`, {rid:this.reloeChangeId})
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                ElMessage.success(res.meta.msg)
                this.getUsersList()
                this.distributeDialogVisible = false
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