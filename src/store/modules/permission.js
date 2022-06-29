import { constantRoutes } from '@/router'
import { dynamicRoutes } from '@/api/menu'
import Layout from '@/layout'

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    const component = tmp.component

    if (component) {
      if (component === 'Layout') {
        tmp.component = Layout
      } else {
        tmp.component = loadView(component)
      }
    }

    if (tmp.children) {
      tmp.children = filterAsyncRoutes(tmp.children, roles)
    }

    res.push(tmp)
  })

  return res
}

const permission = {
  namespaced: true,
  state: {
    routes: [],
    addRoutes: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    }
  },
  actions: {
    generateRoutes({ commit }, roles) {
      return new Promise(resolve => {
        // let accessedRoutes
        dynamicRoutes().then(res => {
          const accessedRoutes = filterAsyncRoutes(res.data, roles)

          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    }
  }
}

export const loadView = view => {
  // console.log(view, process.env.NODE_ENV)
  return resolve => require([`@/views/${view}.vue`], resolve)

  // if (process.env.NODE_ENV === 'development') {
  //   return resolve => require([`@/views/${view}`], resolve)
  // } else {
  //   // 使用 import 实现生产环境的路由懒加载
  //   return () => import(`@/views/${view}`)
  // }
}

export default permission
