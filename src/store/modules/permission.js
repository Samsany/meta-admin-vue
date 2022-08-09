import { constantRoutes } from '@/router'
import { dynamicRoutes } from '@/api/system/menu'
import Layout from '@/layout'
import InnerLink from '@/layout/components/InnerLink'
import ParentView from '@/layout/components/ParentView'

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

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  return routes.map(route => {
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === 'Layout') {
        route.component = Layout
        if (!route.path.startsWith('/')) {
          route.path = '/' + route.path
        }
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children) {
      route.children = filterAsyncRoutes(route.children)
    }
    return route
  })
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
