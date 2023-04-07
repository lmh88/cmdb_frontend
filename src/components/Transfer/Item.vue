<template>
  <div :class="['item', {'child': child}]">
    <div class="item-title">
      <el-checkbox
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
      ></el-checkbox>
      {{ title }}
    </div>
    <div
      v-if="showSearch"
      class="search"
    >
      <el-input
        v-model="search"
        placeholder="录入名称快速选择"
        size="mini"
      />
    </div>
    <el-checkbox-group
      class="item-main"
      :class="[{showSearch: 'item-main-search'}]"
      v-model="selected"
      @change="handleCheckedCitiesChange"
    >
      <el-checkbox
        class="checkbox"
        v-for="item in filterList"
        v-if="!child || item.show"
        :label="item[propsData.value]"
        :key="item[propsData.value]"
        :disabled="!child && item.disabled"
      >{{ item[propsData.name] }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { deepClone } from '@/utils'
import { setTimeout } from 'timers'
export default {
  name: 'Item',
  model: {
    prop: 'value',
    event: 'ggggg'
  },
  props: {
    // 标题
    title: {
      type: String,
      default: '列表'
    },
    // 唯一标志
    name: {
      type: String,
      default: ''
    },
    // 全部数组，通过disabled 和 show分别控制 主和子框中 多选框的展示情况
    list: {
      type: Array,
      default: () => []
    },
    // 多选框选中情况
    value: {
      type: Array,
      default: () => []
    },
    // 数组转化
    propsData: {
      type: Object,
      default: () => ({
        value: 'value',
        name: 'name'
      })
    },
    // 是否为子穿梭款
    child: {
      type: Boolean,
      default: false
    },
    // 显示搜索框
    showSearch: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    value(val) {
      this.selected = val
    },
    selected(val) {
      this.$emit('ggggg', val) //③组件内对selected变更后向外部发送事件通知
    },
    list: {
      deep: true, //深度监听
      handler: function(val) {
        this.filterList = deepClone(
          val.filter(
            key =>
              key[this.propsData.name].toLowerCase().indexOf(this.search) >= 0
          )
        )
      }
    },
    filterList: {
      deep: true, //深度监听
      handler: function(val) {
        if (this.child) {
          // 传出实际显示的全部多选框
          this.$emit('get-value', this.name, val.filter(v => v.show === true))
        } else {
          this.$emit(
            'get-value',
            this.name,
            val.filter(v => v.disabled === false || v.disabled === undefined)
          )
        }
      }
    },
    search(val) {
      let value = val.toLowerCase()
      this.filterList = this.list.filter(
        key => key[this.propsData.name].toLowerCase().indexOf(value) >= 0
      )
    }
  },
  data() {
    return {
      isIndeterminate: true,
      checkAll: false,
      // 选中数组
      selected: this.value,
      search: '',
      filterList: []
    }
  },
  created() {
    this.filterList = deepClone(this.list)
  },
  methods: {
    handleCheckAllChange(val) {
      if (val) {
        if (!this.child) {
          this.selected = this.filterList.map(key => {
            if (!key.disabled) {
              return key[this.propsData.value]
            }
          })
        } else {
          this.selected = this.filterList.map(key => {
            if (key.show) {
              return key[this.propsData.value]
            }
          })
        }
      } else {
        this.selected = []
      }
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length
      let phyLen = this.child
        ? this.filterList.filter(key => key.show === true).length
        : this.filterList.length -
          this.filterList.filter(key => key.disabled === true).length
      this.checkAll = checkedCount === phyLen
      this.isIndeterminate = checkedCount > 0 && checkedCount < phyLen
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  width: 200px;
  /** border 2px **/
  height: 318px;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
  &.child {
    height: 145px;
  }
  .item-title {
    height: 40px;
    padding: 0 10px;
    line-height: 40px;
    background-color: #f5f7fa;
  }
  .search {
    padding: 5px;
  }
  .item-main {
    padding: 0 10px;
    height: calc(100% - 50px);
    overflow-y: auto;
    &.item-main-search {
      height: calc(100% - 80px);
    }
    .checkbox {
      display: block;
      margin-left: 0;
      line-height: 30px;
      font-size: 14px;
    }
  }
}
</style>
