import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/routes',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/roles',
    method: 'get'
  })
}

export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  })
}

export function addRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  })
}

export function updateRole(key, data) {
  return request({
    url: `/roles/${key}`,
    method: 'put',
    data
  })
}
// 菜单列表
export function getMenuList() {
  return request({
    url: '/menu/list',
    method: 'get'
  })
}

// 清空菜单列表缓存
export function refreshtMenuList() {
  return request({
    url: '/menu/clear-menu',
    method: 'get'
  })
}
