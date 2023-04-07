import request from '@/utils/request'

/**
 * @func
 * @desc 获取主机列表
 * @param {object} data - 必填,对象
 * @param {number} data.page - 必填,页数
 * @param {number} data.page_size - 必填,每页条数
 */
export function getHostList(data) {
  return request({
    url: '/v1/host/list',
    method: 'get',
    params: data
  })
}

/**
 * @func
 * @desc 获取主机详情
 * @param {number} id - 主机id
 */
export function getHostDetail(id) {
  return request({
    url: '/v1/host/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * @func
 * @desc 新增主机
 * @param {object} data - 必填,对象
 * @param {number} data.env_id - 必填,环境id
 * @param {string} data.name - 必填,实例姓名
 * @param {number} data.type - 必填,1Web服务器2队列服务器
 * @param {string} data.instance_id - 必填，实例id
 * @param {string} data.internal_ip - 必填，内网ip
 * @param {string} data.external_ip - 必填，公网ip
 * @param {number} data.port - 必填，端口
 * @param {number} data.group_code - 必填，分组编码
 */
export function createHost(data) {
  return request({
    url: '/v1/host/create',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 修改主机
 * @param {object} data - 必填,对象
 * @param {number} data.id - 主机id
 * @param {number} data.env_id - 必填,环境id
 * @param {string} data.name - 必填,实例姓名
 * @param {number} data.type - 必填,1Web服务器2队列服务器
 * @param {string} data.instance_id - 必填，实例id
 * @param {string} data.internal_ip - 必填，内网ip
 * @param {string} data.external_ip - 必填，公网ip
 * @param {number} data.port - 必填，端口
 * @param {number} data.group_code - 必填，分组编码
 */
export function editHost(data) {
  return request({
    url: '/v1/host/update',
    method: 'post',
    data
  })
}

/**
 * @func
 * @desc 删除主机
 * @param {number} id - 主机id
 */
export function deleteHost(id) {
  return request({
    url: '/v1/host/delete',
    method: 'post',
    data: { id: id }
  })
}

/**
 * @func
 * @desc 引入ECS
 * @param {string} region_ids - 必填,区域id，通过多个区域通过分号拼接 eg:cn-hangzhou;cn-shenzhen
 */
export function importEcs(region_ids) {
  return request({
    url: '/v1/host/import',
    method: 'post',
    data: { region_ids: region_ids }
  })
}

/**
 * @func
 * @desc 根据选中的区域显示该区域的主机内容
 * @param {string} region_ids - 必填,区域id，通过多个区域通过分号拼接 eg:cn-hangzhou;cn-shenzhen
 */
export function importList(region_ids) {
  return request({
    url: '/v1/host/import-list',
    method: 'get',
    params: { region_ids: region_ids }
  })
}