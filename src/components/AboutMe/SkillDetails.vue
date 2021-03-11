<template>
  <div>
    <div class="dispaly-center">
      <h1>技术栈分布图</h1>
      <el-button size="small" :class="!isSimplicity && 'action'" @click="switchPic">{{ !isSimplicity ? '切换简约版' : '切换详细版' }}</el-button>
    </div>
    <div v-show="isSimplicity" id="myChart" :style="{ width: '800px', height: '800px'}" />
    <div v-show="!isSimplicity" id="myChartTow" :style="{ width: '800px', height: '800px'}" />
  </div>
</template>

<script>
import echarts from '../../utils/echarts'
export default {
  name: 'SkillDetails',
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isSimplicity: true
    }
  },
  mounted() {
    this.dataList()
  },
  methods: {
    dataList() {
      const divBox = this.isSimplicity ? 'myChart' : 'myChartTow'
      const myChart = echarts.init(document.getElementById(divBox))
      if (this.isSimplicity) {
        this._Simplicity(myChart)
      } else {
        this._details(myChart)
      }
    },

    _Simplicity(myChart) {
      myChart.setOption({
        radar: {
          name: {
            textStyle: {
              color: '#fff',
              backgroundColor: '#999',
              borderRadius: 3,
              padding: [3, 5]
            }
          },
          indicator: [
            { name: 'vue', max: 100 },
            { name: 'react', max: 100 },
            { name: 'JavaScript', max: 100 },
            { name: 'webpack', max: 100 },
            { name: 'uniapp', max: 100 },
            { name: 'typeScript', max: 100 },
            { name: 'JQ', max: 100 }
          ]
        },
        series: [{
          type: 'radar',
          // areaStyle: {normal: {}},
          data: [
            {
              value: [95, 75, 80, 80, 90, 75, 75],
              name: '技术栈熟练度'
            }
          ]
        }]
      })
    },

    _details(myChart) {
      myChart.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            data: [this.data],
            top: '1%',
            left: '7%',
            bottom: '1%',
            right: '20%',
            symbolSize: 7,
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 12
            },

            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      })
    },

    switchPic() {
      this.isSimplicity = !this.isSimplicity
      this.dataList()
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-align: center;
    font-size: 16px;
    color: #666;
    flex: 1;
    margin-left: 100px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      bottom: -8px;
      right: 42%;
      width: 96px;
      height: 3px;
      background-color: #666;
    }
  }
  .action {
    background-color: #409EFF;
    color: #ffffff;
  }
</style>
