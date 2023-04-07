<template>
  <section class="app-main">
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view
          class="main"
          :key="key"
        />
      </keep-alive>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>

<style scoped>
.app-main {
  /*84 = navbar + tags-view = 50 +34 */
  min-height: calc(100vh - 84px - 30px);
  padding: 15px;
  width: calc(100% - 30px);
  overflow: auto;
  position: relative;
  background-color: #f0f0f0;
}
.main {
  overflow-x: auto;
  background-color: #ffffff;
  padding: 15px;
  width: calc(100% - 30px);
  min-width: 900px;
  min-height: calc(100vh - 84px - 30px - 30px);
  box-shadow: 0px 2px 4px 0px rgba(161, 161, 161, 0.45);
  border-radius: 4px;
}
</style>

