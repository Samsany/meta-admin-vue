import request from '@/utils/request'

// 系统路由列表
export function dynamicRoutes() {
  return request({
    url: '/meta-admin/menu/routes',
    method: 'get'
  })
}

// 查询菜单列表
export function listMenu(params) {
  return request({
    url: '/meta-admin/menu/list',
    method: 'get',
    params
  })
}

// 查询菜单详情
export function getMenu(menuId) {
  return request({
    url: `/meta-admin/menu/${menuId}`,
    method: 'get'
  })
}

// 查询菜单下拉列表
export function treeMenuList(params) {
  return request({
    url: '/meta-admin/menu/tree-list',
    method: 'get',
    params
  })
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeSelect(roleId) {
  return request({
    url: `/meta-admin/menu/roleMenuTreeSelect/${roleId}`,
    method: 'get'
  })
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: '/meta-admin/menu',
    method: 'post',
    data
  })
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: '/meta-admin/menu',
    method: 'put',
    data
  })
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: `/meta-admin/menu/delete`,
    method: 'delete',
    data
  })
}
