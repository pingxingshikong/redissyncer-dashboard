<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
import {getDashBoardChart, getMemoryUsed} from '@/api/syncer/info'
export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null,
      legendData: ['实时同步', 'RDB导入', '在线RDB导入', 'AOF导入', '在线AOF导入'],
      seriesName: '任务分类',
      seriesData: [
        { value: 1, name: '实时同步' },
        { value: 1, name: 'RDB导入' },
        { value: 1, name: '在线RDB导入' },
        { value: 1, name: 'AOF导入' },
        { value: 1, name: '在线AOF导入' }
      ]
    }
  },
  created() {


    // setTimeout(() => {
    //   this.getDashBoard()
    // }, 1.5 * 1000)
  },
  mounted() {
    this.$nextTick(() => {
      this.initData()
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          right: 10,
          // left: 'center',
          // bottom: '10',
          data: this.legendData
        },
        series: [
          {
            name: this.seriesName,
            type: 'pie',
            roseType: 'radius',
            radius: [15, 95],
            center: ['50%', '50%'],
            data: this.seriesData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      },true)
    },
    initData() {
      getDashBoardChart().then(response => {
        var infolist = response.data
        this.legendData = infolist.legendData
        this.seriesName = infolist.seriesName
        this.seriesData = infolist.seriesData
        this.initChart()
      })
    }
  }
}
</script>
