import { getInfo, login, logout, refreshLogin } from '@/api/user'
import { getToken, removeToken, setRefreshToken, setToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import { REFRESH_TOKEN_GRANT_TYPE } from '@/utils/global'

const state = {
  token: getToken(),
  userId: '',
  username: '',
  nickname: '',
  avatar: '',
  introduction: '',
  roles: [],
  perms: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_PERMS: (state, perms) => {
    state.perms = perms
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, loginType } = userInfo
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        grant_type: loginType
      })
        .then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { bearerType, accessToken, refreshToken } = data
          commit('SET_TOKEN', bearerType + accessToken)
          setToken(bearerType + accessToken)
          setRefreshToken(refreshToken)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  refreshToken({ commit }, refreshToken) {
    commit('SET_TOKEN', undefined)
    return new Promise((resolve, reject) => {
      refreshLogin({ refresh_token: refreshToken, grant_type: REFRESH_TOKEN_GRANT_TYPE })
        .then(response => {
          const { data } = response
          if (!data) {
            reject('Verification failed, please Login again.')
          }
          const { bearerType, accessToken, refreshToken } = data
          commit('SET_TOKEN', bearerType + accessToken)
          setToken(bearerType + accessToken)
          setRefreshToken(refreshToken)
          resolve(accessToken)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then(response => {
          const { data } = response

          if (!data) {
            reject('Verification failed, please Login again.')
          }

          const { roles, permissions, name, avatar } = data

          // roles must be a non-empty array
          if (!roles || roles.length <= 0) {
            reject('getInfo: roles must be a non-null array!')
          }

          commit('SET_ROLES', roles)
          commit('SET_PERMS', permissions)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          // commit('SET_INTRODUCTION', introduction)
          resolve(data)
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resetRouter()

          // reset visited views and cached views
          // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
          dispatch('tagsView/delAllViews', null, { root: true })

          resolve()
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // dynamically modify permissions
  async changeRoles({ commit, dispatch }, role) {
    const token = role + '-token'

    commit('SET_TOKEN', token)
    setToken(token)

    const { roles } = await dispatch('getInfo')

    resetRouter()

    // generate accessible routes map based on roles
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {
      root: true
    })
    // dynamically add accessible routes
    router.addRoutes(accessRoutes)

    // reset visited views and cached views
    dispatch('tagsView/delAllViews', null, { root: true })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
