<template>
  <div class="navbar">
    <hamburger
      :toggle-click="toggleSideBar"
      :is-active="sidebar.opened"
      class="hamburger-container"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <!-- <el-select
          class="right-menu-item"
          v-model="group"
          placeholder="请选择"
          size="mini"
        >
          <el-option
            v-for="item in groupOptions"
            :key="item.group"
            :label="item.name"
            :value="item.group"
          >
          </el-option>
        </el-select> -->

        <!-- <search class="right-menu-item" /> -->

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull class="right-menu-item hover-effect" />

        <el-tooltip
          :content="$t('navbar.size')"
          effect="dark"
          placement="bottom"
        >
          <size-select class="right-menu-item hover-effect" />
        </el-tooltip>

        <!-- <lang-select class="right-menu-item hover-effect" /> -->

        <!-- <el-tooltip :content="$t('navbar.theme')" effect="dark" placement="bottom">
          <theme-picker class="right-menu-item hover-effect" />
        </el-tooltip> -->
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">

          <span style="vertical-align: top;">您好,{{display_name}}同学</span>
          <i class="el-icon-caret-bottom" />
          <img
            :src="avatar+'?imageView2/1/w/80/h/80'"
            class="user-avatar"
          >
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/">
            <el-dropdown-item>
              系统首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided>
            <span
              style="display:block;"
              @click="logout"
            >退出</span>
          </el-dropdown-item>

        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
// import LangSelect from '@/components/LangSelect'
// import ThemePicker from '@/components/ThemePicker'
// import Search from '@/components/HeaderSearch'

export default {
  data() {
    return {
      groupOptions: [
        {
          group: 'ydyf',
          name: '移动验房'
        },
        {
          group: 'ydzj',
          name: '移动质检'
        }
      ]
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect
    // LangSelect,
    // ThemePicker,
    // Search
  },
  computed: {
    ...mapGetters(['sidebar', 'name', 'avatar', 'device', 'display_name'])
    // group: {
    //   get() {
    //     return this.$store.getters.group || this.groupOptions[0].group || ''
    //   },
    //   set(val) {
    //     this.$store.dispatch('setGroup', val)
    //   }
    // }
  },
  mounted() {
    // this.group = this.$store.getters.group || this.groupOptions[0].group || ''
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('toggleSideBar')
    },
    logout() {
      this.$store
        .dispatch('LogOut', getToken())
        .then(() => {
          location.reload() // In order to re-instantiate the vue-router object to avoid bugs
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
