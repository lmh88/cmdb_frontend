<template>
  <span :class="['circle-icon', color]">
    <slot />
  </span>
</template>

<script>
export default {
  name: 'CircleIcon',
  props: {
    color: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.circle-icon {
  padding-left: 13px;
  position: relative;
  &::before {
    position: absolute;
    top: 2px;
    left: 0;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #81bfff;
    content: "";
  }
  &.green::before {
    background-color: #b8e986;
  }
  &.orange::before {
    background-color: #ffb74d;
  }
  &.red::before {
    background-color: #ff6161;
  }
  &.brown::before {
    background-color: #cf9b4f;
  }
  &.gray::before {
    background-color: #999999;
  }
}
</style>
