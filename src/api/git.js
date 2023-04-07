import request from '@/utils/request'

/**
 * @func
 * @desc 无分页获取git账号列表
 */
export function getGitList() {
  return request({
    url: '/v1/git-account/list-all',
    method: 'get'
  })
}

/**
 * @func
 * @desc 搜索获取git账号列表
 */
export function searchGitList(data) {
  return request({
    url: '/v1/git-account/repo-list',
    method: 'get',
    params: data
  })
}
