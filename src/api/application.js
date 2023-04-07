import request from '@/utils/request'

/**
 * @func
 * @desc 获取应用列表
 * @param {object} data - 必填,对象
 * @param {number} data.page - 必填,页数
 * @param {number} data.page_size - 必填,每页条数
 */
export function getAppList(data) {
  return request({
    url: '/v1/app/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取应用详情
 * @param {number} id - 应用id
 */
export function getAppDetail(id) {
  return request({
    url: '/v1/app/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增应用
 * @param {object} data - 必填,对象
 */
export function createApp(data) {
  return request({
    url: '/v1/app/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改应用
 * @param {object} data - 必填,对象
 */
export function editApp(data) {
  return request({
    url: '/v1/app/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除应用
 * @param {number} id - 应用id
 */
export function deleteApp(id) {
  return request({
    url: '/v1/app/delete',
    method: 'post',
    data: { id: id }
  })
}

/**
 * @func
 * @desc 校验app_code是否合法
 * @param {string} data - 对象
 */
export function checkAppCode(data) {
  return request({
    url: '/v1/app/check-app-code',
    method: 'post',
    data
  })
}
