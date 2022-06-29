import request from '@/utils/request'
import { Base64 } from 'js-base64'
import { CLIENT_NAME, CLIENT_SECRET } from '@/utils/global'

export function login(data) {
  return request({
    url: '/meta-uaa/oauth/token',
    method: 'post',
    headers: {
      Authorization: 'Basic ' + Base64.encode(`${CLIENT_NAME}:${CLIENT_SECRET}`)
    },
    data
  })
}

export function getInfo() {
  return request({
    url: '/meta-uaa/auth/user/info',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
