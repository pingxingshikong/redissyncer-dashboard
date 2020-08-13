<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
  import echarts from 'echarts'
  import resize from "@/views/dashboard/admin/components/mixins/resize";
  import { getDashBoardChart } from "@/api/syncer/monitor";
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
        seriesData: [{value: 50, name: '内存'}]
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
            formatter: '{a} <br/>{b} : {c}%'
          },
          toolbox: {
            feature: {
              restore: {},
              saveAsImage: {}
            }
          },
          series: [
            {
              name: '业务指标',
              type: 'gauge',
              detail: {formatter: '{value}%'},
              data: this.seriesData
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

<style scoped>

</style>
