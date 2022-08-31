import request from '@/utils/request'

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
    url: `/meta-gen/tools/gen/${tableId}`,
    method: 'get'
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
export function previewTable(id) {
  return request({
    url: `/meta-gen/tools/gen/preview/${id}`,
    method: 'get'
  })
}
