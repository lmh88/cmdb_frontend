import request from '@/utils/request'

// 获取用户管理组织架构树
export function getOrgTree() {
  return request({
    url: '/usermanage/user/org-tree',
    method: 'get'
  })
}

/**
 * 通过组织结构id获取用户列表
 * @param {string} data - 选中的组织结构id,以后会加入关键字
 */
export function getUserList(data) {
  return request({
    url: '/usermanage/user/user-list',
    method: 'post',
    data: data
  })
}

// 获取用户详情
export function getUserDetail(ad_name) {
  return request({
    url: '/usermanage/user/user-detail',
    method: 'get',
    params: {
      ad_name: ad_name
    }
  })
}

// 获取分组列表
export function getGroupList() {
  return request({
    url: '/usermanage/group/list',
    method: 'get'
  })
}

/**
 * 组授权
 * @param {string} data - 用户域帐号,选中的分组列表
 */
export function changeUserGroupAuth(data) {
  return request({
    url: '/usermanage/user/user-group-auth',
    method: 'post',
    data: data
  })
}

// 获取角色权限列表
export function getRoleAction() {
  return request({
    url: '/usermanage/role/role-action',
    method: 'get'
  })
}

// 角色授权
export function changeUserRoleAuth(data) {
  return request({
    url: '/usermanage/user/user-role-auth',
    method: 'post',
    data: data
  })
}

