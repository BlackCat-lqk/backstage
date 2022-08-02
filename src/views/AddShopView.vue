<template>
    <div>
        <!-- action是图片要上传到服务器api的地址 -->
        <el-upload
            :action="uploadUrlData"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            list-type="picture"
            method="post"
            :headers="uploadHeaders"
            @on-success="uploadSuccess"
            @on-error="uploadError"
        >
            <el-button type="primary">点击上传</el-button>
        </el-upload>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
export default defineComponent({
    data() {
        return {
            uploadUrlData:"http://127.0.0.1:8888/api/private/v1/upload",
            // 上传图片时设置请求头
            uploadHeaders:{
                Authorization:window.sessionStorage.getItem('token')
            }
        }
    },
    created() {
        
    },
    methods: {
        // 处理图片预览事件
        handlePreview(){

        },
        // 移除图片的事件
        handleRemove(){

        },
        // 上传成功的回调
        uploadSuccess(){

        },
        // 上传成功的回调
        uploadError(){

        }
    },
})
</script>

<style lang="less" scoped>

</style>