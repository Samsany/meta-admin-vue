// 查询db数据库列表
import request from '@/utils/request'

export function listDbTable(params) {
  return request({
    url: '/meta-gen/tools/gen/db/list',
    method: 'get',
    params
  })
}

// 导入表
export function importTable(data) {
  return request({
    url: '/meta-gen/tools/gen/importTable',
    method: 'post',
    data
  })
}
