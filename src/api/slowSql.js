import request from '@/utils/request'

// sql列表
export function getPreSqlList(params) {
  return request({
    url: '',
    method: 'get',
    params
  })
}
// 拉取sql
export function pullSql() {
  return request({
    url: '',
    method: 'get'
  })
}
// 用户列表
export function fetchUsers() {
  return request({
    url: '/front/user/list',
    method: 'get'
  })
}
// 创建应用
export function fetchProjectOne(id) {
  return request({
    url: '/slowsql/v1/get-sql-project',
    method: 'get',
    params: { id: id }
  })
}
// 创建应用
export function createProject(data) {
  return request({
    url: '/slowsql/v1/create-sql-project',
    method: 'post',
    data
  })
}

// 更新应用
export function updateProject(data) {
  return request({
    url: '/slowsql/v1/update-sql-project',
    method: 'post',
    data
  })
}

// 批次列表
export function fetchBatchList(params) {
  return request({
    url: '/slowsql/v1/get-sql-batch-list',
    method: 'get',
    params
  })
}
// 应用列表
export function fetchAppList() {
  return request({
    url: '/slowsql/v1/get-sql-project-list',
    method: 'get'
  })
}
// sql模板列表
export function fetchSqlTemplateList(params) {
  return request({
    url: '/slowsql/v1/get-sql-template-list',
    method: 'get',
    params
  })
}
// 拉取sql
export function pullSqlByApp(data) {
  return request({
    url: '/slowsql/v1/pull',
    method: 'post',
    data
  })
}
// 审核接口
export function auditSqlTemplate(id, status, remark) {
  return request({
    url: '/slowsql/v1/update-audit-status',
    method: 'post',
    data: { id, status, remark }
  })
}

// sql详情
export function fetchSqlDetail(id) {
  return request({
    url: '/slowsql/v1/get-sql-detail',
    method: 'get',
    params: { id: id }
  })
}

// 获取sql建议
export function fetchSqlPropose(id) {
  return request({
    url: '/slowsql/v1/get-sql-propose',
    method: 'get',
    params: { id: id }
  })
}
// 获取建议，不存在则获取后更新
export function fetchProposeWithUpdate(id) {
  return request({
    url: '/slowsql/v1/get-propose-with-update',
    method: 'get',
    params: { id: id }
  })
}

// 获取建议
export function getSuggestion(data) {
  return request({
    url: '/slowsql/v1/sql-parse-propose',
    method: 'post',
    data: { sql: data }
  })
}
