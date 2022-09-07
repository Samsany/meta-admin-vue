import request from '@/utils/request'

// 查询系统角色列表
export function listRole(params) {
  return request({
    url: '/meta-admin/role/list',
    method: 'get',
    params
  })
}

// 查询系统角色详情
export function getRole(id) {
  return request({
    url: `/meta-admin/role/info/${id}`,
    method: 'get'
  })
}

// 新增系统角色
export function addRole(data) {
  return request({
    url: '/meta-admin/role',
    method: 'post',
    data
  })
}

// 修改系统角色
export function updateRole(data) {
  return request({
    url: '/meta-admin/role',
    method: 'put',
    data
  })
}

// 删除系统角色
export function delRole(data) {
  return request({
    url: '/meta-admin/role',
    method: 'delete',
    data
  })
}

// 导出系统角色
export function exportRole(params) {
  return request({
    url: '/meta-admin/role/export',
    method: 'get',
    params
  })
}
