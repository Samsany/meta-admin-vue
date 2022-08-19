import request from '@/utils/request'

// 查询字典数据列表
export function listData(query) {
  return request({
    url: '/meta-admin/dict/data/list',
    method: 'get',
    params: query
  })
}

// 查询字典数据详情
export function getData(dictDataId) {
  return request({
    url: `/meta-admin/dict/data/${dictDataId}`,
    method: 'get'
  })
}

// 根据字典类型查询字典数据信息
export function getDictDataList(dictType) {
  return request({
    url: `/meta-admin/dict/data/type/${dictType}`,
    method: 'get'
  })
}

// 新增字典数据
export function addData(data) {
  return request({
    url: '/meta-admin/dict/data',
    method: 'post',
    data
  })
}

// 修改字典数据
export function updateData(data) {
  return request({
    url: '/meta-admin/dict/data',
    method: 'put',
    data
  })
}

// 删除字典数据
export function delData(dictDataIds) {
  return request({
    url: `/meta-admin/dict/data/${dictDataIds}`,
    method: 'delete'
  })
}
