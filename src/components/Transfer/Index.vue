<template>
  <div class="transfer">
    <div class="left transfer-item">
      <Item
        :ref="name[0]"
        :title="title[0]"
        :name="name[0]"
        :list="list"
        v-model="all"
        :props-data="propsData"
        :show-search="showSearch[0]"
        @get-value="getValue"
      />
    </div>
    <div class="middle">
      <div class="middle-item">
        <el-button
          class="icon icon-right"
          @click="toRight('one')"
          icon="el-icon-arrow-right"
          :disabled="toRightDisabled"
        ></el-button>
        <el-button
          class="icon"
          @click="toLeft('one')"
          icon="el-icon-arrow-left"
          :disabled="toLeftDisabledOne"
        ></el-button>
      </div>
      <div class="middle-item middle-bottom">
        <el-button
          class="icon icon-right"
          @click="toRight('two')"
          icon="el-icon-arrow-right"
          :disabled="toRightDisabled"
        ></el-button>
        <el-button
          class="icon"
          @click="toLeft('two')"
          icon="el-icon-arrow-left"
          :disabled="toLeftDisabledTwo"
        ></el-button>
      </div>
    </div>
    <div class="right transfer-item">
      <Item
        :ref="name[1]"
        :title="title[1]"
        :name="name[1]"
        :list="listone"
        :child="true"
        v-model="one"
        :props-data="propsData"
        :show-search="showSearch[1]"
        @get-value="getValue"
      />
      <Item
        :ref="name[2]"
        :title="title[2]"
        :name="name[2]"
        :list="listtwo"
        :child="true"
        v-model="two"
        :props-data="propsData"
        :show-search="showSearch[2]"
        @get-value="getValue"
      />
    </div>
  </div>
</template>

<script>
import Item from './Item'
import { deepClone } from '@/utils'
import { setTimeout } from 'timers'
export default {
  name: 'Transfer',
  model: {
    prop: 'valueList',
    event: 'getValue'
  },
  props: {
    // 标题
    title: {
      type: Array,
      default: () => ['列表1', '列表2', '列表3']
    },
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
    showSearch: {
      type: Array,
      default: () => [true, false, false]
    },
    name: {
      type: Array,
      default: () => ['all', 'one', 'two']
    },
    selected: {
      type: Array,
      default: () => [[], [], []]
    }
  },
  data() {
    return {
      // 所有选项的数组
      list: this.selected[0],
      listone: this.selected[1],
      listtwo: this.selected[2],
      // 多选框勾选的情况
      all: [],
      one: [],
      two: [],
      toRightDisabled: false,
      toLeftDisabledOne: true,
      toLeftDisabledTwo: true,
      valueList: {}
    }
  },
  components: { Item },
  watch: {
    selected(val) {
      this.list = deepClone(val[0])
      this.listone = deepClone(val[1])
      this.listtwo = deepClone(val[2])
    },
    all(val) {
      this.toRightDisabled = val.length > 0 ? false : true
    },
    one(val) {
      this.toLeftDisabledOne = val.length > 0 ? false : true
    },
    two(val) {
      this.toLeftDisabledTwo = val.length > 0 ? false : true
    }
  },
  methods: {
    toRight(dir) {
      let index
      this.list.map((key, keyIndex) => {
        index = this.all.indexOf(key[this.propsData.value])
        if (index >= 0) {
          this.$set(this['list'][keyIndex], 'disabled', true)
          this.$set(this['list' + dir][keyIndex], 'show', true)
        }
      })
      this.all = []
    },
    toLeft(dir) {
      this[dir].forEach(item => {
        this.list.forEach((key, keyIndex) => {
          if (key[this.propsData.value] === item) {
            this.$set(this['list'][keyIndex], 'disabled', false)
            this.$set(this['list' + dir][keyIndex], 'show', false)
          }
        })
      })
    },
    getValue(name, value) {
      this.$set(this.valueList, name, value)
      this.$emit('getValue', this.valueList)
    },
    refresh() {
      this.name.map(item => {
        this.$refs[item].getValue()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.transfer {
  width: 100%;
  max-width: 550px;
  min-width: 480px;
  height: 320px;
  overflow: hidden;
  display: flex;
  justify-content: space-between;
  .transfer-item {
    width: 202px;
  }
  .left {
  }
  .middle {
    margin: 0 10px;
    width: 50px;
    height: 100%;
    .middle-item:first-child {
      height: 100px !important;
      margin-bottom: 50px;
    }
    .middle-item:nth-child(2) {
      height: 150px !important;
    }
    .middle-item {
      display: flex;
      flex-wrap: wrap;
      align-content: space-around;
    }
    .icon {
      border-radius: 50%;
      margin-left: 0;
      width: 50px;
      height: 50px;
      &.icon-right {
        /deep/ .el-icon-arrow-right {
          margin-left: 1px;
        }
      }
    }
  }
  .right {
    .item:first-child {
      height: 100px !important;
      margin-bottom: 20px;
    }
    .item:nth-child(2) {
      height: 200px !important;
    }
  }
}
</style>
