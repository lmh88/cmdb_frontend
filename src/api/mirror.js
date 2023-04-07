import request from '@/utils/request'

/**
 * @func
 * @desc 获取镜像列表
 * @param {object} data - 必填,对象
 * @param {number} data.page - 必填,页数
 * @param {number} data.page_size - 必填,每页条数
 */
export function getMirrorList(data) {
  return request({
    url: '/v1/base-image/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取镜像详情
 * @param {number} id - 镜像id
 */
export function getMirrorDetail(id) {
  return request({
    url: '/v1/base-image/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增镜像
 * @param {object} data - 必填,对象
 */
export function createMirror(data) {
  return request({
    url: '/v1/base-image/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改镜像
 * @param {object} data - 必填,对象
 */
export function editMirror(data) {
  return request({
    url: '/v1/base-image/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除镜像
 * @param {number} id - 镜像id
 */
export function deleteMirror(id) {
  return request({
    url: '/v1/base-image/delete',
    method: 'post',
    data: { id: id }
  })
}
