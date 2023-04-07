<template>
  <pre
    ref="logRecord"
    class="log-record"
    v-html="log"
  ></pre>
</template>

<script>
import { scrollToBottom } from '@/utils/scrollTo'
export default {
  name: 'LogRecord',
  props: {
    log: {
      type: String,
      default: ''
    }
  },
  mounted() {
    scrollToBottom(this.$refs.logRecord)
  }
}
</script>

<style lang="scss" scoped>
.log-record {
  margin-top: 15px;
  background: rgba(248, 248, 248, 1);
  border-radius: 4px;
  border: 1px solid rgba(220, 223, 230, 1);
  font-weight: 400;
  font-size: 12px;
  color: rgba(34, 34, 34, 1);
  line-height: 24px;
  padding: 15px;
  word-break: break-all;
  white-space: pre-wrap;
  height: 300px;
  overflow-y: auto;
}
</style>
