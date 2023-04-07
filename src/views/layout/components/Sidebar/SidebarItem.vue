<template>
  <div v-if="item.children || item.path || item.link" class="menu-wrapper">

    <template v-if="item.children.length <= 0">
      <app-link :item="item">
        <el-menu-item :index="item.path" :class="{'submenu-title-noDropdown':!isNest}">
          <item :icon="item.icon" :title="item.remark" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="item.path" popper-append-to-body>
      <template slot="title">
        <item :icon="item.icon" :title="item.remark" />
      </template>
      <sidebar-item
        v-for="(child,index) in item.children"
        :key="index"
        :is-nest="true"
        :item="child"
        class="nest-menu"
      />
    </el-submenu>

  </div>
</template>

<script>
// import path from 'path'
import Item from './Item'
import FixiOSBug from './FixiOSBug'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  }
}
</script>
