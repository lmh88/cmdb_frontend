import request from '@/utils/request'

/**
 * @func
 * @desc 获取分组列表
 * @param {object} data - 对象
 * @param {number} data.page - 非必填,页数
 * @param {number} data.page_size - 非必填,每页条数
 */
export function getEnvList(data) {
  return request({
    url: '/v1/env/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取环境详情
 * @param {number} id - 环境id
 */
export function getEnvDetail(id) {
  return request({
    url: '/v1/env/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增环境
 * @param {object} data - 必填,对象
 */
export function createEnv(data) {
  return request({
    url: '/v1/env/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改环境
 * @param {object} data - 必填,对象
 */
export function editEnv(data) {
  return request({
    url: '/v1/env/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除环境
 * @param {number} id - 环境id
 */
export function deleteEnv(id) {
  return request({
    url: '/v1/env/delete',
    method: 'post',
    data: { id: id }
  })
}

/**
 * @func
 * @desc 无分页获取环境列表
 */
export function getEnvListAll() {
  return request({
    url: '/v1/env/list-all',
    method: 'get'
  })
}

/**
 * @func
 * @desc 无分页获取jerkins列表
 */
export function getJenkinsListAll() {
  return request({
    url: '/v1/jenkins/list-all',
    method: 'get'
  })
}

/**
 * @func
 * @desc 校验环境名是否存在
 * @param {number} env_id - 环境id
 * @param {string} env - 环境名称
 */
export function checkEnv(env, env_id) {
  return request({
    url: '/v1/env/check-env-name',
    method: 'post',
    data: {
      env: env,
      env_id: env_id
    }
  })
}
