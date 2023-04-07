<template>
  <div class="frame">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="(item,index) in menuList"
          :key="index"
          :item="item"
        />
      </el-menu>
    </el-scrollbar>
    <i
      :class="['el-icon-refresh', isRefresh ? 'rotate' : '']"
      ref="refresh"
      title="点击刷新菜单"
      @click="refreshMenu"
    ></i>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import variables from '@/styles/variables.scss'
import { getMenuList, refreshtMenuList } from '@/api/role'
import Logo from './logo'

export default {
  components: { SidebarItem, Logo },
  data() {
    return {
      // 是否刷新菜单，控制按钮的旋转
      isRefresh: false,
      menuList: []
    }
  },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  created() {
    this.getMenu()
  },
  methods: {
    // 获取菜单列表
    getMenu() {
      getMenuList()
        .then(res => {
          this.menuList = res.data.menu_list
          sessionStorage.setItem('auth', res.data.action_codes)
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 刷新菜单
    refreshMenu() {
      this.isRefresh = true
      refreshtMenuList().then(res => {
        this.getMenu()
        this.isRefresh = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.frame {
  height: 100%;
}

/deep/ .el-scrollbar {
  height: 100%;
}
.el-icon-refresh {
  bottom: 5px;
  right: 5px;
  position: absolute;
  font-size: 16px;
  color: #fff;
  cursor: pointer;
}
.rotate {
  -webkit-animation: 1s rotate linear infinite normal;
  animation: 1s rotate linear infinite normal;
}
@keyframes rotate {
  from {
    -webkit-transform: rotate(0);
    transform: rotate(0);
  }
  to {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
    display: none;
  }
}
</style>
