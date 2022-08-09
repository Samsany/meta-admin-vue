import store from '@/store'

// 校验用户是否拥有按钮权限
function hasPermission(el, binding) {
  const roles = store.getters && store.getters.roles
  // 超级管理员拥有所有的按钮权限
  if (roles.includes('SUPER_ADMIN')) {
    return true
  }
  const { value } = binding
  const allPermission = '*:*:*'
  const perms = store.getters && store.getters.perms
  if (value && value instanceof Array && value.length > 0) {
    const requiredPerms = value
    const hasPermission = perms.some(perm => {
      return allPermission === perm || requiredPerms.includes(perm)
    })
    if (!hasPermission) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  } else {
    throw new Error(`请设置操作权限标签值`)
  }
}

export default {
  inserted(el, binding) {
    hasPermission(el, binding)
  },
  update(el, binding) {
    hasPermission(el, binding)
  }
}
