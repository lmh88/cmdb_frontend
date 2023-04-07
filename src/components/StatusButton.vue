<template>
  <span :class="['status-button', color]">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'StatusButton',
  props: {
    color: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.status-button {
  display: inline-block;
  cursor: pointer;
  border-radius: 4px;
  padding: 0 10px;
  height: 26px;
  line-height: 26px;
  font-size: 12px;
  color: #fff;
  background-color: #53a6fa;
  &.green {
    background-color: #1cbf3b;
  }
  &.orange {
    background-color: #ffb94d;
  }
  &.red {
    background-color: #ff6161;
  }
  &.gray {
    background-color: #dbdbdb;
  }
}
</style>
