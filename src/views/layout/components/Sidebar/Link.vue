
<template>
  <!-- eslint-disable vue/require-component-is -->
  <component v-bind="linkProps(item)">
    <slot />
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    linkProps(item) {
      if (isExternal(item.path)) {
        return {
          is: 'a',
          href: item.path,
          target: item.target,
          rel: 'noopener'
        }
      }
      return {
        is: 'router-link',
        to: item.path
      }
    }
  }
}
</script>
