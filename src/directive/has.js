// 权限

import Vue from 'vue'

// 自定义指定v-has
const has = Vue.directive('has', {
  bind: function(el, binding) {
    if (!Vue.prototype.$_has(binding.value)) {
      el.style.display = 'none'
    }
  }
})

Vue.prototype.$_has = function(value) {
  let isExist = false
  //  获取拥有的权限
  const auth = sessionStorage.getItem('auth')
  // 权限列表
  if (auth.indexOf(value) !== -1) {
    isExist = true
  }
  return isExist
}
const $_has = Vue.prototype.$_has

export default { has, $_has }