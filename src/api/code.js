import request from '@/utils/request'

/**
 * @func
 * @desc 获取代码仓库列表
 * @param {object} data - 必填,对象
 * @param {number} data.page - 必填,页数
 * @param {number} data.page_size - 必填,每页条数
 */
export function getCodeList(data) {
  return request({
    url: '/v1/repository/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 在应用模块中获取仓库列表
 * @param {object} data - 必填,对象
 */
export function getCodeListAll(data) {
  return request({
    url: '/v1/repository/list-all',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取代码仓库详情
 * @param {number} id - 代码仓库id
 */
export function getCodeDetail(id) {
  return request({
    url: '/v1/repository/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增代码仓库
 * @param {object} data - 必填,对象
 */
export function createCode(data) {
  return request({
    url: '/v1/repository/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改代码仓库
 * @param {object} data - 必填,对象
 */
export function editCode(data) {
  return request({
    url: '/v1/repository/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除代码仓库
 * @param {number} id - 代码仓库id
 */
export function deleteCode(id) {
  return request({
    url: '/v1/repository/delete',
    method: 'post',
    data: { id: id }
  })
}

/**
 * @func
 * @desc 校验仓库地址是否合法
 * @param {string} data - 仓库地址
 */
export function checkAddress(data) {
  return request({
    url: '/v1/repository/check-repo-addr',
    method: 'post',
    data
  })
}
