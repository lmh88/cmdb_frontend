import { loginByUsername, logout, getUserInfo } from '@/api/login'
import { setToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

const user = {
  state: {
    user: '',
    status: '',
    code: '',
    token: Cookies.get('token') || '',
    name: Cookies.get('name') || '',
    username: '',
    avatar: '',
    introduction: '',
    roles: [],
    setting: {
      articlePlatform: []
    },
    group_code: Cookies.get('group_code') || '',
    leaf_org: Cookies.get('leaf_org') || ''
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
      Cookies.set('token', token)
    },
    SET_INTRODUCTION: (state, introduction) => {
      state.introduction = introduction
    },
    SET_SETTING: (state, setting) => {
      state.setting = setting
    },
    SET_STATUS: (state, status) => {
      state.status = status
    },
    SET_NAME: (state, name) => {
      state.name = name
      Cookies.set('name', name)
    },
    SET_USERNAME: (state, username) => {
      state.username = username
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
      Cookies.set('avatar', avatar)
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_GROUP_CODE: (state, group_code) => {
      state.group_code = group_code
      Cookies.set('group_code', group_code)
    },
    SET_LEAF_ORG: (state, leaf_org) => {
      state.leaf_org = leaf_org
      Cookies.set('leaf_org', leaf_org)
    }
  },

  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        loginByUsername(username, userInfo.password)
          .then(res => {
            commit('SET_TOKEN', res.data.token)
            commit('SET_NAME', res.data.ad_name)
            commit('SET_LEAF_ORG', res.data.leaf_org)
            setToken(res.data.token)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    // 企业微信扫码通过扫码登录时要存名字和部门
    // GetScanUserInfo({ commit }, userInfo) {
    //   commit('SET_NAME', userInfo.ad_name)
    //   commit('SET_LEAF_ORG', userInfo.leaf_org)
    // },
    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(res => {
            // 由于mockjs 不支持自定义状态码只能这样hack
            if (!res) {
              reject('获取用户信息失败')
            }
            const data = res.data
            if (res.errcode === 0) {
              if (data.roles && data.roles.length > 0) {
                // 验证返回的roles是否是一个非空数组
                commit('SET_ROLES', data.roles)
              }
              commit('SET_NAME', data.ad_name)
              commit('SET_USERNAME', data.username)
              commit(
                'SET_AVATAR',
                'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
              )
            }
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 第三方验证登录
    // LoginByThirdparty({ commit, state }, code) {
    //   return new Promise((resolve, reject) => {
    //     commit('SET_CODE', code)
    //     loginByThirdparty(state.status, state.email, state.code).then(res => {
    //       commit('SET_TOKEN', res.token)
    //       setToken(res.token)
    //       resolve()
    //     }).catch(error => {
    //       reject(error)
    //     })
    //   })
    // },

    // 登出
    LogOut({
      commit
    }, token) {
      return new Promise((resolve, reject) => {
        logout(token)
          .then(() => {
            commit('SET_LEAF_ORG', '')
            commit('SET_NAME', '')
            removeToken()
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    },

    // 动态修改权限
    ChangeRoles({ commit, dispatch }, role) {
      return new Promise(resolve => {
        commit('SET_TOKEN', role)
        setToken(role)
        getUserInfo(role).then(res => {
          const data = res
          commit('SET_ROLES', data.roles)
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_INTRODUCTION', data.introduction)
          dispatch('GenerateRoutes', data) // 动态修改权限后 重绘侧边菜单
          resolve()
        })
      })
    },

    setGroupCode({ commit, dispatch }, group_code) {
      return new Promise(resolve => {
        commit('SET_GROUP_CODE', group_code)
        resolve()
      })
    }
  }
}

export default user
