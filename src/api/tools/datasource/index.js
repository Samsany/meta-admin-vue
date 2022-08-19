import request from '@/utils/request'

// 查询数据源列表
export function listDataSource(params) {
  return request({
    url: '/meta-gen/tools/datasource/list',
    method: 'get',
    params
  })
}

// 查询数据源连接测试
export function connectDataSource(data) {
  return request({
    url: `/meta-gen/tools/datasource/connect`,
    method: 'post',
    data
  })
}

// 查询数据源详情
export function getDataSource(id) {
  return request({
    url: `/meta-gen/tools/datasource/${id}`,
    method: 'get'
  })
}

// 新增数据源
export function addDataSource(data) {
  return request({
    url: '/meta-gen/tools/datasource',
    method: 'post',
    data
  })
}

// 修改数据源
export function updateDataSource(data) {
  return request({
    url: '/meta-gen/tools/datasource',
    method: 'put',
    data
  })
}

// 删除数据源
export function delDataSource(data) {
  return request({
    url: `/meta-gen/tools/datasource`,
    method: 'delete',
    data
  })
}
