<template>
  <div class="login-container">
    <div class="login-box">
      <div class="pander">
        <img
          v-if="panderShow"
          src="@/assets/login_images/normal.png"
          alt="熊猫"
          width="110px"
        >
        <img
          v-if="!panderShow"
          src="@/assets/login_images/blindfold.png"
          alt="熊猫"
          width="110px"
        >
      </div>
      <div class="login-pic">
        <img
          src="@/assets/login_images/login.png"
          alt="testPhoto"
        >
      </div>
      <div>
        <span class="login-type">域账号登录</span>
        <!-- 企业微信扫码 -->
        <!-- <img
          v-if="!loginType"
          class="qrcode"
          src="@/assets/login_images/qrcode.png"
          alt="扫码"
          width="24px"
          @click="changeLoginType"
        > -->
        <el-form
          v-show="!loginType"
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
          auto-complete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">
              CMDB
            </h3>
          </div>

          <el-form-item
            prop="username"
            :class="[ isUserFocus ?'focusInput' : '']"
          >
            <span class="svg-container">
              <svg-icon
                icon-class="user"
                :class="[ isUserFocus ?'svg-container-focus' : 'svg-container-blur ']"
              />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入账号"
              name="username"
              type="text"
              autocomplete="off"
              @focus="getUserFocus"
              @blur="getUserFocus"
            />
          </el-form-item>

          <el-form-item
            prop="password"
            :class="[ isPassFocus ?'focusInput' : '']"
          >
            <span class="svg-container">
              <svg-icon
                icon-class="password"
                :class="[ isPassFocus?'svg-container-focus' : 'svg-container-blur ']"
              />
            </span>
            <el-input
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              auto-complete="on"
              @keyup.enter.native="handleLogin"
              @focus="getPassFocus"
              @blur="getPassFocus"
            />
            <span
              class="show-pwd"
              @click="showPwd"
            >
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <el-checkbox v-model="rememberAccount">记住账号</el-checkbox>
          <el-button
            class="login-submit"
            :loading="loading"
            type="primary"
            style="margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >
            登录
            <i class="el-icon-right"></i>
          </el-button>
        </el-form>
      </div>
      <!-- 企业微信扫码 -->
      <!-- <div>
        <span
          class="login-type"
          v-if="loginType"
        >扫码登录</span>
        <img
          v-if="loginType&&internet"
          class="qrcode"
          src="@/assets/login_images/account.png"
          alt="帐号"
          width="24px"
          @click="changeLoginType"
        >
        <div
          v-show="loginType"
          id="wx_qrcode"
          class="wxQrcode"
        ></div>
      </div> -->
      <div class="copyright">Copyright © 2019 明源云链 版权所有</div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { validUsername } from '@/utils/validate'
import { getWeixinConfig } from '@/api/wechat'
import { setToken } from '@/utils/auth'
import LangSelect from '@/components/LangSelect'
import SocialSign from './socialsignin'
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  components: { LangSelect, SocialSign },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('账号为域帐号'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      rememberAccount: true,
      // 企业微信扫码内网或外网
      // internet: true,
      // 登录类型
      loginType: false,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', message: '请输入密码' }]
      },
      passwordType: 'password',
      loading: false,
      showDialog: false,
      redirect: undefined,
      isUserFocus: false,
      isPassFocus: false,
      panderShow: true
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['token'])
  },
  mounted() {
    // 企业微信扫码
    // this.getWechatScan()
    this.getCookieAccount()
  },
  methods: {
    getCookieAccount() {
      if (Cookies.get('username')) {
        this.loginForm.username = Cookies.get('username')
      }
    },
    // 企业微信扫码
    // getWechatScan() {
    //   getWeixinConfig().then(res => {
    //     console.log('企业微信登录', res)
    //     const wechatScan = res.data
    //     // 企业微信扫码处理重定向问题
    //     console.log('企业微信登录', wechatScan)
    //     const redirect_uri = encodeURIComponent(
    //       wechatScan.redirect_uri +
    //         '?redirect_url=' +
    //         encodeURIComponent(
    //           location.href.split('#')[0] +
    //             '#/' +
    //             location.href.split('redirect=%2F')[1] // 获取登录时的redirect参数
    //         )
    //       // 解决企业微信扫码无法重定向的bug
    //     )
    //     if (!wechatScan.is_internal_ip) {
    //       this.internet = false
    //       this.loginType = true
    //     }
    //     window.WwLogin({
    //       id: 'wx_qrcode',
    //       appid: wechatScan.app_id,
    //       agentid: wechatScan.agent_id,
    //       redirect_uri: redirect_uri,
    //       state: '',
    //       href: 'https://devops-test.mysre.cn/static/scan/scan.css'
    //     })
    //   })
    // },
    changeLoginType() {
      this.loginType = !this.loginType
    },
    getUserFocus() {
      this.isUserFocus = !this.isUserFocus
    },
    getPassFocus() {
      this.isPassFocus = !this.isPassFocus
      this.panderShow = !this.panderShow
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.rememberAccount) {
            Cookies.set('username', this.loginForm.username)
          } else {
            Cookies.remove('username')
          }
          this.$store
            .dispatch('LoginByUsername', this.loginForm)
            .then(() => {
              this.loading = false
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    afterQRScan() {
      // const hash = window.location.hash.slice(1)
      // const hashObj = getQueryObject(hash)
      // const originUrl = window.location.origin
      // history.replaceState({}, '', originUrl)
      // const codeMap = {
      //   wechat: 'code',
      //   tencent: 'code'
      // }
      // const codeName = hashObj[codeMap[this.auth_type]]
      // if (!codeName) {
      //   alert('第三方登录失败')
      // } else {
      //   this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
      //     this.$router.push({ path: '/' })
      //   })
      // }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #333;
$light_gray: #eee;
$dark_gray: #333;
$cursor: #333;
$white: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
    &::first-line {
      color: #666;
    }
    height: 44px;
  }
}

/* reset element-ui css */
.login-container {
  .el-form-item__error {
    padding-top: 8px;
    padding-left: 4px;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 20px 5px 15px 0px;
      height: 44px;
      caret-color: $cursor;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $white inset !important;
        -webkit-text-fill-color: $bg !important;
      }
    }
  }
  .el-form-item {
    // border-bottom: 1px #d5dce7 solid;
    background-image: linear-gradient(#428aff, #428aff),
      linear-gradient(#d5dce7, #d5dce7);
    background-size: 0px 2px, 100% 1px;
    background-repeat: no-repeat;
    background-position: center bottom, center calc(100% - 1px);
    color: #d5dce7;
    margin-bottom: 24px;
    z-index: 3000;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #f5f5f5;
$dark_gray: #333;
$light_gray: #fff;

.login-container {
  height: 100%;
  width: 100%;
  // background-color: $bg;
  overflow: hidden;
  .login-box {
    width: 980px;
    height: 440px;
    position: relative;
    margin: 0 auto;
    position: absolute;
    top: 150px;
    left: calc(50% - 490px);
    background-color: $light_gray;
    box-shadow: 0 6px 6px #dddddd;
    -webkit-border-radius: 24px;
    border-radius: 24px;
    .pander {
      position: absolute;
      top: -66px;
      right: 0px;
    }
    .el-checkbox {
      margin-left: 2px;
    }
  }
  .qrcode {
    margin-bottom: 42px;
    cursor: pointer;
    position: absolute;
    right: 44px;
    top: 42px;
  }
  .login-form {
    float: right;
    max-width: 100%;
    padding: 102px 56px 0 0px;
    width: 270px;
    overflow: hidden;
  }
  .wxQrcode {
    position: absolute;
    right: 47px;
    top: 94px;
  }
  .login-pic {
    float: left;
    width: 600px;
    height: 440px;
    box-sizing: border-box;
    img {
      width: 100%;
      height: 100%;
      -webkit-border-top-left-radius: 24px;
      -webkit-border-bottom-left-radius: 24px;
      border-top-left-radius: 24px;
      border-bottom-left-radius: 24px;
    }
  }
  .login-type {
    position: absolute;
    left: 638px;
    top: 48px;
    color: #afc5da;
  }
  .svg-container {
    // padding: 6px 0px 6px 15px;
    color: #afc5da;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    padding-left: 4px;
  }
  .svg-container-blur {
    color: #afc5da;
  }
  .svg-container-focus {
    color: #428aff;
  }
  .focusInput {
    background-size: 100% 2px, 100% 1px;
    transition: all 0.5s;
    border: none;
    outline: none;
  }
  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #333;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 700;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 12px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .login-submit {
    width: 100%;
    height: 40px;
    border-radius: 6px;
    border: none;
    margin-top: 22px;
    background-color: linear-gradient(-90deg, #45b7ff, #3678ff);
    -webkit-box-shadow: 0 4px 12px 0 rgba(31, 147, 255, 0.4);
    box-shadow: 0 4px 12px 0 rgba(31, 147, 255, 0.4);
  }
  .copyright {
    position: absolute;
    bottom: -120px;
    width: 100%;
    text-align: center;
    font-size: 14px;
    color: #999;
  }
}
</style>
