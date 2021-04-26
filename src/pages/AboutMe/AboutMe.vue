<template>
  <div class="about-me">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item>关于ShanJ</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="about-me-body dispaly-space">
      <div class="about-me-userinfo">
        <div class="info dispaly-space">
          <!-- <img src="http://www.liaojs.cn:3000/public/assets/myself.jpg" alt=""> -->
          <div class="user-hobby">
            <div class="item">
              <h2>一丶关于ShanJ</h2>
              <p class="text">1.一个对Web前端稍有研究的渣渣人员</p>
              <p class="text">2.ShanJ博客的创始人</p>
              <p class="text">3.拥有丰富的前端开发经验</p>
            </div>
            <div class="item">
              <h2>二丶关于金牛座</h2>
              <p class="text">节奏不同是你们天生的问题，一个冲动，一个慢半拍，要把你们放在同一个世界一起生活，看来大家要非常容忍对方，如果不是，很难看到长远，金牛座固执的性格，中间拉拉扯扯的时候，可能白羊座已经忍不住转身就走。如果真是可以走在一起，大家不妨用双打网球的原理，一个补、一个攻，大前提当然是已经能理解和接受对方的特性</p>
            </div>
          </div>
        </div>
        <div class="javascript" style="width: 100% ">
          <el-tabs v-model="activeName">
            <el-tab-pane label="技术栈分布图" name="1">
              <div style="width: 100%">
                <SkillDetails :data="data" />
              </div>
            </el-tab-pane>
            <el-tab-pane label="好友博客互留" name="2">
              <p class="noting f1 dispaly-content-center">暂无数据......</p>
            </el-tab-pane>
          </el-tabs>

        </div>
      </div>
      <div class="right">
        <blogShortcutBar />
      </div>
    </div>

  </div>
</template>

<script>
import blogShortcutBar from '@/components/blogShortcutBar/blogShortcutBar'
import SkillDetails from '../../components/AboutMe/SkillDetails'
export default {
  name: 'AboutMe',
  components: {
    blogShortcutBar,
    SkillDetails
  },
  data() {
    return {
      activeName: '1',
      data: {
        'name': '技术栈',
        'children': [
          {
            'name': '前端框架',
            'children': [
              {
                'name': 'VUE',
                'children': [
                  { 'name': 'vuex', 'value': 100 },
                  { 'name': 'vue-router', 'value': 100 }
                ]
              },
              {
                'name': 'React',
                'children': [
                  { 'name': 'react-hooks', 'value': 80 },
                  { 'name': 'dva', 'value': 80 },
                  { 'name': 'react-router', 'value': 80 },
                  { 'name': 'react-redux', 'value': 80 }
                ]
              },
              {
                'name': 'JQ'
              }
            ]
          },
          {
            'name': '前端基础',
            'children': [
              { 'name': 'html5', 'value': 100 },
              { 'name': 'JavaScript', 'value': 90 },
              { 'name': 'CSS3', 'value': 100 }
            ]
          },
          {
            'name': '前端工具',
            'children': [
              { 'name': 'webpack', 'value': 90 },
              { 'name': 'Sass', 'value': 90 },
              { 'name': 'Less', 'value': 90 },
              { 'name': 'typeScript', 'value': 80 }
            ]
          },
          {
            'name': 'UI组件',
            'children': [
              { 'name': 'elementUI' },
              { 'name': 'vue-elment-admin' },
              { 'name': 'MintUI' },
              { 'name': 'Ant-Mobile' },
              { 'name': 'bootstrap' }
            ]
          },
          {
            'name': '数据库相关',
            'children': [
              { 'name': 'MySQL' },
              { 'name': 'MongoDB' }
            ]
          },
          {
            'name': '版本管理、文档和自动化部署工具',
            'children': [
              { 'name': 'Git' },
              { 'name': 'Svn' }
            ]
          },
          {
            'name': '云和开放平台',
            'children': [
              { 'name': '微信小程序', value: '80' },
              { 'name': 'uniapp混合开发', value: '90' },
              { 'name': 'RN', value: '60' }
            ]
          }
        ]
      }
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .about-me {
    padding-top: 30px;
    padding-bottom: 20px;
  }
  .about-me-body {
    margin: 20px 0;
  }
  .user-hobby {
    margin: 10px 0 0 20px;
    font-size: 14px;
    .item {
      margin: 15px 0 40px;
    }
  }
  h2 {
    font-size: 16px;
    font-weight: 600;
    color: #73706d;
    margin-bottom: 10px;
  }
  .text {
    color: #666;
    line-height: 25px;
    margin-bottom: 8px;
    text-indent: 22px;
  }
  .about-me-userinfo {
    width: 72%;
    padding: 10px 10px 20px;
    margin-right: 40px;
    background-color: #fff;
    img {
      min-width: 300px;
      height: 404px;
    }
  }
  .right {
    width: 28%;
  }
  .noting {
    font-size: 36px;
    color: #666;
    font-weight: bold;
    margin-top: 30px;
  }
</style>
