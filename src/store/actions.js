import { IS_USER_LOGIN, ADMIN_TOKEN, LOGOUT } from './mutation-types'

import { setToken, removeToken, getToken } from '../utils/token'

import { getUserInfo } from '../api/user'

export default {

  isLogin({ commit }, token) {
    setToken(token)
    commit(IS_USER_LOGIN, { token })
  },

  adminUserInfo({ commit }) {
    return new Promise(resolve => {
      getUserInfo().then(res => {
        const userInfo = res.data.userInfo
        commit(ADMIN_TOKEN, { userInfo })
        commit(IS_USER_LOGIN, { token: getToken() })
        resolve()
      })
    })
  },

  logout({ commit }) {
    removeToken('token')
    commit(LOGOUT)
    location.reload()
  },

  setLoginViewState({ commit }, loginState) {
    commit('SET_LOGIN_VIEW_STATE', loginState)
  }

}
