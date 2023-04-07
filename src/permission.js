import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
// import { UrlSearch } from './utils/urlsearch' // 企业微信扫码
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// 白名单
const whiteList = ['/login', '/auth-redirect', '/401', '/404']

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  // 企业微信扫码
  // const param = new UrlSearch() // 如果是在url上取token,则采用此方法
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const token = getToken()
      if (token === 'null' || token === '') {
        next({ path: '/login' })
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    }
    // 企业微信扫码登录
    // if (param.token) {
    //   setToken(param.token)
    //   store.dispatch('GetScanUserInfo', param)
    //   // 企业微信扫码获取当前的地址的路径如 user
    //   const href = location.href.split('?')[0].split('/#/')[1]
    //   // 跳到当前地址
    //   next(`/${href}`)
    // } else {
    //   next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
    // }
    NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
