import request from '@/utils/request'

// 查询字典类型列表
export function listType(params) {
  return request({
    url: '/meta-admin/dict/type/list',
    method: 'get',
    params
  })
}

// 查询字典类型详情
export function getType(dictId) {
  return request({
    url: `/meta-admin/dict/type/${dictId}`,
    method: 'get'
  })
}

// 新增字典类型
export function addType(data) {
  return request({
    url: '/meta-admin/dict/type',
    method: 'post',
    data
  })
}

// 修改字典类型
export function updateType(data) {
  return request({
    url: '/meta-admin/dict/type',
    method: 'put',
    data
  })
}

// 删除字典类型
export function delType(dictIds) {
  return request({
    url: `/meta-admin/dict/type/${dictIds}`,
    method: 'delete'
  })
}

// 刷新字典缓存
export function refreshCache() {
  return request({
    url: '/meta-admin/dict/type/refresh-cache',
    method: 'delete'
  })
}

// 获取字典选择框列表
export function optionSelect() {
  return request({
    url: '/meta-admin/dict/type/option-select',
    method: 'get'
  })
}
