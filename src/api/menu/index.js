import request from '@/utils/request'

export function dynamicRoutes() {
  return request({
    url: '/meta-admin/menu/routes',
    method: 'get'
  })
}
