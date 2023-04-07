import request from '@/utils/request'

// 获取业务组环境配置信息
export function getEnvConfig() {
  return request({
    url: '/sqlrelease/release/env-config',
    method: 'get'
  })
}

/**
 * @func
 * @desc 获取业务组环境的rds信息
 * @param {object} data - 对象
 * @param {string} data.group - 组名
 * @param {number} data.is_private - 是否私有化
 * @param {string} data.env - 环境
 */
export function getEnvDb(data) {
  return request({
    url: '/sqlrelease/release/env-db',
    method: 'get',
    params: data
  })
}

/**
 * 新增主机
 * @param {object} data - 必填,对象
 * @param {string} data.group - 必填,组名
 * @param {number} data.is_private - 必填,是否私有化
 * @param {string} data.env - 必填,环境
 * @param {string} data.db_tag_id - 与db_target有一个必填,选中的数据库标签id
 * @param {string} data.db_target - 与db_tag_id有一个必填,选中的自定义数据库，例如：[{“id”:”rds8508o09s32x10n4fs”,”childs”:[“mycommunity_retesting”]}]
 * @param {string} data.sql_file_urls - 与sql_text有一个必填,上传的sql文件列表
 * @param {string} data.sql_text - 与sql_file_urls有一个必填,填入的sql文本
 * @param {string} data.remark - 申请原因
 */
export function publishSql(data) {
  return request({
    url: '/sqlrelease/release/create',
    method: 'post',
    data: data
  })
}

/**
 * 获取SQL发布列表
 * @param {object} data - 对象
 * @param {string} data.group - 组名
 * @param {string} data.begin_date - 发布开始日期，例如：2019-06-25
 * @param {string} data.end_date - 发布结束日期，例如：2019-06-26
 * @param {string} data.keyword - 搜索关键字
 * @param {number} data.only_current_user - 是否只查询当前用户发布的 0 为不
 * @param {string} data.status - 状态
 * @param {number} data.page - 分页参数
 * @param {number} data.page_size - 分页参数
 */
export function getSqlList(data) {
  return request({
    url: '/sqlrelease/release/list',
    method: 'get',
    params: data
  })
}

/**
 * 获取SQL详情
 * @param {string} id - SQL id
 */
export function getSqlDetail(id) {
  return request({
    url: '/sqlrelease/release/detail',
    method: 'get',
    params: { id: id }
  })
}

/**
 * 获取SQL执行结果
 * @param {string} id - SQL id
 */
export function getSqlResult(id) {
  return request({
    url: '/sqlrelease/release/execute-result',
    method: 'get',
    params: { id: id }
  })
}

/**
 * 获取SQL工作流
 * @param {string} id - SQL id
 */
export function getSqlWorkFlow(id) {
  return request({
    url: '/sqlrelease/workflow/get-info',
    method: 'get',
    params: { bizId: id }
  })
}

/**
 * 获取上传sql的 url
 */
export function getSqlUploadUrl() {
  return request({
    url: '/sqlrelease/oss/get-upload-url',
    method: 'get'
  })
}

/**
 * 上传sql
 * @param {string} url - 请求 url
 * @param {string} data - 二进制文件
 */
export function uploadSql(url, data) {
  return request({
    url: url,
    method: 'put',
    headers: { 'Content-Type': 'text/x-sql' },
    data
  })
}

/**
 * 获取上传的sql文件的url
 * @param {string} url - SQL url
 */
export function getSqlFileUrl(url) {
  return request({
    url: '/sqlrelease/oss/get-download-url',
    method: 'get',
    params: { base64fileurl: url }
  })
}

/**
 * 获取上传的sql文件的文本
 * @param {string} url - SQL url
 */
export function getSqlFile(url) {
  return request({
    url: url,
    method: 'get'
  })
}

/**
 * 审核通过
 * @param {object} data - 信息
 * @param {string} data.process_id - 必填，流程实例id
 * @param {string} data.step_id - 必填，当前处理步骤id
 * @param {string} data.remark - 可选，审批说明
 */
export function approveSql(data) {
  return request({
    url: '/sqlrelease/workflow/approve',
    method: 'post',
    params: data
  })
}

/**
 * 审核驳回
 * @param {object} data - 信息
 * @param {string} data.process_id - 必填，流程实例id
 * @param {string} data.step_id - 必填，当前处理步骤id
 * @param {string} data.remark - 可选，审批说明
 */
export function refuseSql(data) {
  return request({
    url: '/sqlrelease/workflow/refuse',
    method: 'post',
    params: data
  })
}
