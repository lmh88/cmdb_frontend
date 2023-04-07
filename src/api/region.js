import request from '@/utils/request'

/**
 * @func
 * @desc 获取区域列表
 */
export function getRegionList() {
  return request({
    url: '/v1/region/list-all',
    method: 'post'
  })
}

/**
 * @func
 * @desc 更新区域
 */
export function getRegionRefresh() {
  return request({
    url: '/v1/region/update',
    method: 'post'
  })
}
