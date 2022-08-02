<template>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片列表 -->
    <el-card class="box-card">
        <el-row>
            <el-col>
                <div id="main" style="width:600px; height:400px"></div>
            </el-col>
        </el-row>
    </el-card>
</template>

<script>
import {defineComponent} from 'vue'
import * as echarts from 'echarts';
import echartsApi from '../http/api/echartsData.js'
import { ElMessage } from 'element-plus';
export default defineComponent({
    data() {
        return {
            // 折线图legend数据
            legend:[],
            series:[],
            xAxis:[],

        }
    },
    created() {
        
    },
    beforeMount(){
        this.getEchartsData()
    },
    // 在渲染完成的钩子函数中初始化echarts
    async mounted(){
        const res = await echartsApi.echartsDataShowApi('')
        if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
        this.legend = res.data.legend
        this.xAxis = res.data.xAxis[0]
        this.yAxis = res.data.yAxis
        for(let i = 0; i < res.data.series.length; i++){
            this.series.push(res.data.series[i])
        }
        var chartDom = document.getElementById('main');
        var myChart = echarts.init(chartDom);
        var option;

        option = {
        title: {
            text: '数据统计（折线图）'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
            type: 'cross',
            label: {
                backgroundColor: '#6a7985'
            }
            }
        },
        legend: {
            data:this.legend.data
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
            type: 'category',
            boundaryGap: false,
            data: this.xAxis.data
            }
        ],
        yAxis: [
            {
            type: 'value'
            }
        ],
        series: this.series
        };

        option && myChart.setOption(option);
    },
    methods: {
        async getEchartsData(){
            
            const res = await echartsApi.echartsDataShowApi('')
            if(res.meta.status != 200) return ElMessage.error(res.meta.msg)
            this.legend = res.data.legend
            this.xAxis = res.data.xAxis[0]
            this.yAxis = res.data.yAxis
            for(let i = 0; i < res.data.series.length; i++){
                this.series.push(res.data.series[i])
            }
            console.log('拿到echarts数据')
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