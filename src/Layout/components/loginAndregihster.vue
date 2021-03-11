<template>
  <div>
    <div v-show="isShow" class="index-bgc" />
    <div v-show="isShow" class="index-function">
      <div class="title">
        <p>{{ isLogin ? '登录Shanj博客' : '注册Shanj博客' }}</p>
        <i class="el-icon-close" @click="replaceData" />
      </div>
      <div class="body">
        <el-form
          ref="dataForm"
          :model="formData"
          :rules="rules"
        >
          <el-form-item label="电子邮箱" prop="username">
            <el-input v-model="formData.username" placeholder="请输入邮箱">
              <i slot="prefix" class="el-input__icon el-icon-s-custom" />
            </el-input>
          </el-form-item>

          <el-form-item v-if="!isLogin" label="验证码" prop="yzm">
            <br>
            <div class="dispaly-center register">
              <el-input v-model="formData.yzm" placeholder="请输入邮箱验证码">
                <i slot="prefix" class="el-input__icon el-icon-success" />
              </el-input>
              <el-button
                class="button"
                :disabled="typeof yzmMsg === 'number'"
                :style="typeof yzmMsg === 'number' ? '' : null"
                @click="sendYzm"
              >{{ yzmMsg }}</el-button>
            </div>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="formData.password" type="password" placeholder="请输入密码" @keydown.enter.native="subForm">
              <i slot="prefix" class="el-input__icon el-icon-lock" />
            </el-input>
          </el-form-item>
        </el-form>
        <div class="index-btn">
          <el-button class="button" @click="subForm">{{ isLogin ? '登录' : '注册' }}</el-button>
          <div class="index-alert-info dispaly-flex">
            <p>
              {{ isLogin ? '没有账号' : '已有账号' }}？
              <span
                @click="repalce(true)"
              >{{ isLogin ? '注册' : '登录' }}</span>
            </p>
            <p>{{ isLogin ? '忘记密码' : null }}</p>
          </div>
        </div>
        <div class="index-onther-btn">
          <p>{{ isLogin ? '第三方登录' : '第三方注册' }}</p>
          <div>
            <span class="iconfont iconQQ" />
            <span class="iconfont icongit" @click="gotoOrderLogin()" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  userLogin,
  sendMsg,
  registerSub
} from '@/api/user'
import { gitHubLogin } from '@/api/index'
import { messages } from '@/utils/message'
import { getUrlKey } from '@/utils/getUrlKey'
export default {
  props: {
    formType: {
      type: String,
      default: 'login'
    },

    isShowUserFun: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      gitHubUrl: process.env.VUE_APP_GIT_LOGIN,
      userFunctionType: 'login',
      yzmMsg: '发送验证码',
      formData: {
        username: '',
        password: '',
        yzm: ''
      },
      rules: {
        username: [{ required: true, validator: (rule, val, cb) => {
          console.log(!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val) || !val)
          !/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val) || !val ? cb(new Error('邮件格式不正确')) : cb()
        }, trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        yzm: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      gitHubCode: ''
    }
  },

  computed: {
    isLogin() {
      return this.userFunctionType === 'login'
    },

    isShow() {
      return this.isShowUserFun || this.$store.state.isShowLoginView
    }
  },

  watch: {
    formType(val) {
      this.userFunctionType = val
    }
  },

  created() {
    this.gitHubCode = getUrlKey('code')
    this.gitHubCode && this.gitHubLogin()
  },

  methods: {
    repalce(type = false) {
      if (type) {
        // 如果只是登录注册切换
        this.userFunctionType = this.userFunctionType === 'login' ? 'register' : 'login'
      }
      Object.keys(this.formData).forEach(i => (this.formData[i] = ''))
    },

    gitHubLogin() {
      const client_id = 'Iv1.61e6f59c8fc30634' // id值
      const client_secret = '821a18bac0ea7ef79185896efa3478ef3c1882b8'
      this.$loadShow()
      gitHubLogin(client_id, client_secret, this.gitHubCode).then(res => {
        // 发送请求GitHub用户信息
        this.$store.dispatch('adminUserInfo')
        this.$close()
      }).catch(() => this.$close())
    },

    subForm() {
      const { username, password, yzm } = this.formData
      const { isLogin } = this
      const obj = {
        username,
        password
      }
      const handleFunction = {
        userLogin,
        registerSub
      }
      !isLogin && (obj.yzm = yzm)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$loadShow()
          handleFunction[isLogin ? 'userLogin' : 'registerSub'](obj).then(res => {
            this.replaceData()
            messages(isLogin ? '登录成功！' : '注册成功！')
            this.$store.dispatch('isLogin', res.data.token)
            this.$store.dispatch('adminUserInfo')
            this.$close()
          }).catch(() => {
            this.$close()
          })
        }
      })
    },

    replaceData() {
      this.$store.dispatch('setLoginViewState', false)
      this.repalce()
      this.close()
    },

    close() {
      this.$emit('closeForm')
    },

    sendYzm() {
      // 发送验证码
      if (this.formData.username) {
        let count = 60
        const timer = setInterval(() => {
          this.yzmMsg = count--
          if (count === 0) {
            this.yzmMsg = '发送验证码'
            clearInterval(timer)
          }
        }, 1000)
        sendMsg(this.formData.username).then(res => {
          messages('已发送至邮箱')
        })
      } else {
        messages('请填写邮箱', 'error')
      }
    },

    gotoOrderLogin() {
      location.href = this.gitHubUrl
    }
  }
}
</script>

<style lang="scss" spoced>
.index-bgc {
  width: 100%;
  height: 100%;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.6);
}

.index-function {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 100;
  background-color: #fff;
  padding: 5px 20px;
  border-radius: 5px;
  .title {
    display: flex;
    justify-content: flex-end;
    border-bottom: 1px solid #e8eaec;
    padding: 14px 0;
    p {
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #363940;
      line-height: 1;
      font-weight: bold;
    }
    i {
      font-weight: bold;
      font-size: 16px;
      cursor: pointer;
    }
  }
  .body {
    font-size: 14px;
    color: #333333;
    width: 400px;

    .register {
      .button {
        /*width: 80px;*/
        margin-left: 10px;
        display: block;
        border-radius: 4px;
        border: none;
        text-align: center;
        /*line-height: 36px;*/
        color: #fff;
        background: #19be6b;
        cursor: pointer;
      }
    }

    .index-btn {
      margin-top: 20px;
      .button {
        display: block;
        width: 100%;
        margin-bottom: 8px;
        border-radius: 4px;
        border: none;
        text-align: center;
        color: #fff;
        background: #19be6b;
        cursor: pointer;
      }
      .index-alert-info {
        span,
        p:nth-of-type(2) {
          color: #2a8bec;
          cursor: pointer;
        }
      }
    }
    .index-onther-btn {
      margin: 20px 0 10px;
      > div {
        padding: 15px 0;
        text-align: center;
        span {
          cursor: pointer;
          font-size: 38px;
        }
        span:nth-of-type(1) {
          color: #1a98fc;
          margin-right: 20px;
        }
        span:nth-of-type(2) {
          color: #24292e;
          margin-left: 10px;
        }
      }
    }
  }
}
</style>

