import request from '@/utils/request'

/**
 * @func
 * @desc 获取分组列表
 * @param {object} data - 对象
 * @param {number} data.page - 非必填,页数
 * @param {number} data.page_size - 非必填,每页条数
 */
export function getGroupList(data) {
  return request({
    url: '/v1/group/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取分组详情
 * @param {number} id - 分组id
 */
export function getGroupDetail(id) {
  return request({
    url: '/v1/group/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增分组
 * @param {object} data - 必填,对象
 * @param {string} data.group_code - 必填,分组编码
 * @param {string} data.name - 必填,分组名称
 * @param {number} data.is_master - 必填,是否主分组
 */
export function createGroup(data) {
  return request({
    url: '/v1/group/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改分组
 * @param {object} data - 必填,对象
 * @param {string} data.name - 必填,分组名称
 * @param {number} data.is_master - 必填,是否主分组
 */
export function editGroup(data) {
  return request({
    url: '/v1/group/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除分组
 * @param {number} id - 分组id
 */
export function deleteGroup(id) {
  return request({
    url: '/v1/group/delete',
    method: 'post',
    data: { id: id }
  })
}

/**
 * @func
 * @desc 无分页获取分组列表
 */
export function getGroupListAll() {
  return request({
    url: '/v1/group/list-all',
    method: 'get'
  })
}
