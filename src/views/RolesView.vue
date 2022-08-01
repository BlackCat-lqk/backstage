<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片列表 -->
        <el-card class="box-card">
            <el-row>
                <el-col>
                    <el-button size="large" type="primary" @click="addRoleDialog=true">添加角色</el-button>
                    <!-- 添加角色的对话框 -->
                    <el-dialog
                        v-model="addRoleDialog"
                        title="添加角色"
                        width="30%"
                    >
                        <el-form
                            ref="addRoleFormRef"
                            :model="addRoleFrom"
                            :rules="addRoleRules"
                            class="demo-ruleForm"
                        >
                            <el-form-item label="角色名称" prop="roleName">
                                <el-input v-model="addRoleFrom.roleName"/>
                            </el-form-item>
                            <el-form-item label="角色描述" prop="roleDesc">
                                <el-input v-model="addRoleFrom.roleDesc"/>
                            </el-form-item>
                        </el-form>
                        <template #footer>
                        <span class="dialog-footer">
                            <el-button @click="closeAddRoleDialog">取消</el-button>
                            <el-button type="primary" @click="addRole">确认</el-button>
                        </span>
                        </template>
                    </el-dialog>
                </el-col>
            </el-row>
            <el-table :data="RolesList" stripe border size="large">
                <!-- 折叠区 -->
                <el-table-column type="expand">
                    <template #default="scope">
                    <!-- {{scope}} -->
                        <el-row v-for="(item1) in scope.row.children" :key="item1.id" class="one-el-row">
                            <!-- 一级渲染 -->
                            <el-col :span="5" class="el-col-one">
                                <el-tag class="mx-1" size="large" closable type="" @close="deleteThEvelAuthority(scope.row, item1.id)">{{item1.authName}}</el-tag>
                            </el-col>
                            <!-- 二级和三级渲染 -->
                            <el-col :span="19">
                                <el-row v-for="(item2) in item1.children" :key="item2.id">
                                    <el-col :span="4">
                                        <el-tag style="padding:10px;" class="mx-1" size="large" closable type="warning" @close="deleteThEvelAuthority(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                    </el-col>
                                    <el-row :span="18" v-for="(item3) in item2.children" :key="item3.id">
                                        <el-col>
                                            <el-tag class="mx-1" size="large" closable type="danger" @close="deleteThEvelAuthority(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                        </el-col>
                                    </el-row>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>                    
                </el-table-column>
                <el-table-column type="index" label="序号" width="70px"/>
                <el-table-column prop="roleName" label="角色名称"/>
                <el-table-column prop="roleDesc" label="角色描述"/>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" icon="Edit" @click="editGetRole(scope.row.id)">编辑</el-button>
                        <!-- 删除用户 -->
                        <el-button type="danger" icon="Delete" @click="deleteRole(scope.row.id)">删除</el-button>
                        <!-- 更多 -->
                        <el-button type="warning" icon="More" @click="PermissionsDialog(scope.row)">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 编辑角色的对话框 -->
        <el-dialog
            v-model="editRoleDialog"
            title="编辑角色"
            width="30%"
        >
            <el-form
                ref="editRoleFormRef"
                :model="editRoleFrom"
                :rules="editRoleRules"
                class="demo-ruleForm"
            >
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="editRoleFrom.roleName"/>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="editRoleFrom.roleDesc"/>
                </el-form-item>
            </el-form>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeEditRoleDialog">取消</el-button>
                <el-button type="primary" @click="editRole">确认</el-button>
            </span>
            </template>
        </el-dialog>

        <!-- 树形权限对话框 -->
        <el-dialog
            v-model="assignPermissionsDialog"
            title="分配权限"
            width="35%"
            @close="closeAssignDialog"
        >
            <el-tree 
                :data="assignPermissionsList"
                default-expand-all
                show-checkbox
                :default-checked-keys="defKeys"
                node-key="id"
                ref="treeRef"
                :props="treeProps"/>
            <template #footer>
            <span class="dialog-footer">
                <el-button @click="assignPermissionsDialog=false">取消</el-button>
                <el-button type="primary" @click="assignPermissions(commitRoleId)">确认</el-button>
            </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    import { ElMessage, ElMessageBox } from 'element-plus'
    import {defineComponent} from 'vue'
    import roles from '../http/api/roles.js'
    import permissions from '../http/api/permissions_list.js'
    export default defineComponent({
        data() {
            return {
                // 角色列表
                RolesList:[],
                // 添加角色表单
                addRoleFrom:{
                    // 角色名称
                    roleName:'',
                    // 角色描述
                    roleDesc:'',
                },
                // 添加角色的表单验证规则
                addRoleRules:{
                    roleName:[
                        { required: true, message: '请输入合法角色名称', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                    roleDesc:[
                        { required: false, message: '请输入合法角色描述', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                },
                // 是否显示添加角色对话框
                addRoleDialog:false,
                // 是否显示编辑角色对话框
                editRoleDialog:false,
                // 编辑角色表单
                editRoleFrom:{
                    // 当前编辑的角色id
                    roleId:'',
                    // 角色名称
                    roleName:'',
                    // 角色描述
                    roleDesc:'',
                },
                // 添加角色的表单验证规则
                editRoleRules:{
                    roleName:[
                        { required: true, message: '请输入合法角色名称', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                    roleDesc:[
                        { required: false, message: '请输入合法角色描述', trigger: 'blur' },
                        { min: 3, max: 8, message: '长度应在3-8位之间', trigger: 'blur' },
                    ],
                },
                // 是否显示分配权限对话框
                assignPermissionsDialog : false,
                // 树形权限列表数据
                assignPermissionsList:[],
                // 树形要显示的数据
                treeProps:{
                    children: 'children',
                    label: 'authName',
                },
                // 树形控件默认选中的节点id
                defKeys:[],
                // 提交分配权限时的角色id
                commitRoleId:'',
            }
        },
        created() {
            this.getRolesList()
        },
        methods: {
            // 获取角色列表
            async getRolesList(){
                const res = await roles.getRolesList('')
                if(res.meta.status != 200){
                    return ElMessage.error(res.meta.msg)
                }else{
                    this.RolesList = res.data
                }
            },
            // 添加角色对话框关闭并重置
            closeAddRoleDialog(){
                this.addRoleDialog = false
                this.$refs.addRoleFormRef.resetFields()
            },
            // 添加角色
            addRole(){
                this.$refs.addRoleFormRef.validate(async(vali)=>{
                    if(!vali) return ElMessage.error('请输入合法参数')
                    const res = await roles.addRolesApi(this.addRoleFrom)
                    if(res.meta.status != 201){
                        ElMessage.error(res.meta.msg)
                        this.closeAddRoleDialog()
                    }else{
                        this.getRolesList()
                        ElMessage.success(res.meta.msg)
                        this.closeAddRoleDialog()
                    }
                })
            },
            // 删除角色
            deleteRole(id){
                ElMessageBox.confirm(
                    '将会永久删除一个角色，确认继续?',
                    '删除角色',
                    {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning',
                    }
                ).then( async() => {
                    const res = await roles.deleteRoleInfoApi(`/roles/${id}`)
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
                        this.getRolesList()
                    }
                }).catch(() => {
                ElMessage({
                        type: 'error',
                        message: '删除失败',
                    })
                })
            },
            // 编辑角色对话框关闭并重置
            closeEditRoleDialog(){
                this.editRoleDialog = false
                this.$refs.editRoleFormRef.resetFields()
            },
            // 获取编辑角色信息
            async editGetRole(id){
                this.editRoleDialog = true
                const res = await roles.getRoleInfoApi(`/roles/${id}`)
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.editRoleFrom = res.data
            },
            // 编辑角色信息提交
            editRole(){
                this.$refs.editRoleFormRef.validate(async(vali)=>{
                    if(!vali) return ElMessage.error('请输入合法参数')
                    const res = await roles.editRoleInfoApi(this.editRoleFrom)
                    if(res.meta.status != 200){
                        ElMessage.error(res.meta.msg)
                        this.closeEditRoleDialog()
                    }else{
                        this.getRolesList()
                        ElMessage.success(res.meta.msg)
                        this.closeEditRoleDialog()
                    }
                })
            },
            // 展开的删除权限
            deleteThEvelAuthority(role, right_id){
                ElMessageBox.confirm(
                    '确认删除该权限?',
                    '删除权限',
                    {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: '警告',
                    }
                ).then( async() => {
                    const res = await roles.deleteEvelAuthority(`/roles/${role.id}/rights/${right_id}`)
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
                        return role.children = res.data
                    }
                }).catch(() => {
                ElMessage({
                        type: 'error',
                        message: '删除失败',
                    })
                })
            },
            // 递归拿到第三级的权限id数组
            getPermissionsIdArry(node, arr){
                if(!node.children) return arr.push(node.id)
                node.children.forEach((nodeNext)=>{
                    this.getPermissionsIdArry(nodeNext, arr)
                })
            },
            // 分配权限弹出
            async PermissionsDialog(row){
                this.getPermissionsIdArry(row, this.defKeys)
                this.assignPermissionsDialog=true
                // 获取树形权限列表
                const res = await permissions.getPermissionsList(`/rights/tree`)
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                this.assignPermissionsList = res.data
                this.commitRoleId = row.id
            },
            // 监听权限分配对话框的关闭
            closeAssignDialog(){
                this.defKeys = []
            },
            // 确认提交分配权限
            async assignPermissions(id){
                const keys = [
                    ...this.$refs.treeRef.getCheckedKeys(),
                    ...this.$refs.treeRef.getHalfCheckedKeys()
                ]
                const keysStr = {rids:keys.join(',')}
                const res = await roles.roleAuthorizeApi(`/roles/${id}/rights`, keysStr)
                if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
                ElMessage.success(res.meta.msg)
                this.getRolesList()
                this.assignPermissionsDialog = false
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