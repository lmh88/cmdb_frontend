<template>
  <div class="errPage-container">
    <el-row>
      <el-col
        :span="12"
        class="wrap-content"
      >
        <h1 class="text-jumbo text-ginormous">403</h1>
        <h2 class="text-auth">很抱歉，您没有权限访问该页面</h2>
        <h6 class="text-said"> 您可以先返回首页或联系您的领导为您增加权限</h6>
        <ul class="list-unstyled">
          <li class="link-type">
            <router-link to="/dashboard">
              <el-button
                icon="arrow-left"
                class="pan-back-btn btn"
              >返回首页</el-button>
            </router-link>
          </li>

        </ul>
      </el-col>
      <el-col :span="12">
        <img
          :src="errGif"
          alt="Girl has dropped her ice cream."
          width="400px"
        >
      </el-col>
    </el-row>

  </div>
</template>

<script>
import errGif from '@/assets/403_images/403-mobile.png'

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap:
        'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false
    }
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' })
      } else {
        this.$router.go(-1)
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.errPage-container {
  width: 1000px;
  max-width: 100%;
  margin: 78px auto;
  .wrap-content {
    margin-top: 100px;
  }
  .link-type {
    float: left;
    margin-right: 20px;
  }
  .btn {
    color: #fff;
    border-radius: 50px;
    border: none !important;
    font-size: 12px;
  }
  .pan-back-btn {
    background: #0f84fe;
  }
  .pan-refresh-btn {
    background: #61ca2f;
  }
  .pan-gif {
    margin: 0 auto;
    display: block;
    text-align: center;
  }
  .pan-img {
    display: block;
    margin: 0 auto;
    width: 100%;
  }
  .text-jumbo {
    font-size: 80px;
    color: #bcc1cc;
    font-weight: 600;
    margin-bottom: 30px;
  }
  .text-auth {
    font-size: 30px;
    color: #333;
    margin-bottom: 12px;
  }
  .text-said {
    font-size: 13px;
    line-height: 22px;
    color: #999;
    margin: 0 0 20px 2px;
    letter-spacing: 0.5px;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
