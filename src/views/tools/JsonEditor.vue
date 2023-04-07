

<template>
  <div class="components-container">
    <div>
      <el-button
        type="success"
        @click="parseJson"
      >点击格式化</el-button>
      <hr>
    </div>
    <el-row>
      <el-col :span="11">
        <div class="editor-container">
          <json-editor
            ref="jsonEditor"
            v-model="value"
          />
        </div>
      </el-col>
      <el-col :span="2">
      </el-col>
      <el-col :span="11">
        <div>
          <json-editor v-model="formatValue" />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import JsonEditor from '@/components/JsonEditor'

// const jsonData =
//   '[{"items":[{"market_type":"forexdata","symbol":"XAUUSD"},{"market_type":"forexdata","symbol":"UKOIL"},{"market_type":"forexdata","symbol":"CORN"}],"name":""},{"items":[{"market_type":"forexdata","symbol":"XAUUSD"},{"market_type":"forexdata","symbol":"XAGUSD"},{"market_type":"forexdata","symbol":"AUTD"},{"market_type":"forexdata","symbol":"AGTD"}],"name":"贵金属"},{"items":[{"market_type":"forexdata","symbol":"CORN"},{"market_type":"forexdata","symbol":"WHEAT"},{"market_type":"forexdata","symbol":"SOYBEAN"},{"market_type":"forexdata","symbol":"SUGAR"}],"name":"农产品"},{"items":[{"market_type":"forexdata","symbol":"UKOIL"},{"market_type":"forexdata","symbol":"USOIL"},{"market_type":"forexdata","symbol":"NGAS"}],"name":"能源化工"}]'
const jsonData = '[{"eg1":"demo1","eg2":"demo2" }]'

export default {
  name: 'JsonEditorDemo',
  components: { JsonEditor },
  data() {
    return {
      value: JSON.parse(jsonData),
      formatValue: JSON.parse(jsonData)
    }
  },
  methods: {
    parseJson() {
      this.formatValue = JSON.parse(this.value)
    }
  }
}
</script>

<style scoped>
.editor-container {
  position: relative;
  height: 100%;
}
</style>

