import { default as request } from '@/utils/request'

// 查询生成数据库表列表
export function listGenTable(params) {
  return request({
    url: `/meta-gen/tools/gen/list`,
    method: 'get',
    params
  })
}

// 查询数据库列表
export function listDbTable(params) {
  return request({
    url: `/meta-gen/tools/gen/db/list`,
    method: 'get',
    params
  })
}

// 查询表详细信息
export function getGenTable(tableId) {
  return request({
    url: `/meta-gen/tools/gen/info/${tableId}`,
    method: 'get'
  })
}

// 更新表生成信息
export function updateGenTable(data) {
  return request({
    url: '/meta-gen/tools/gen',
    method: 'put',
    data
  })
}

// 导入表
export function importTable(dsName, data) {
  return request({
    url: `/meta-gen/tools/gen/importTable/${dsName}`,
    method: 'post',
    data
  })
}

// 预览生成代码
export function previewTable(tableId) {
  return request({
    url: `/meta-gen/tools/gen/preview/${tableId}`,
    method: 'get'
  })
}

// 生成代码
export function genCode(tableId) {
  return request({
    url: `/meta-gen/tools/gen/code/${tableId}`,
    method: 'get'
  })
}

// 批量生成代码
export function genCodeBatch(data) {
  return request({
    url: `/meta-gen/tools/gen/codeBatch`,
    method: 'post',
    responseType: 'blob',
    data
  })
}

// 同步数据库
export function syncDb(tableId) {
  return request({
    url: `/meta-gen/tools/gen/syncDb/${tableId}`,
    method: 'get'
  })
}
