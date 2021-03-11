
import { IS_USER_LOGIN, ADMIN_TOKEN, LOGOUT, SET_LOGIN_VIEW_STATE } from './mutation-types'

export default {

  [IS_USER_LOGIN](state, { token }) {
    state.token = token
  },

  [ADMIN_TOKEN](state, { userInfo }) {
    state.userInfo = userInfo
  },

  [LOGOUT](state) {
    state.token = ''
  },

  [SET_LOGIN_VIEW_STATE](state, loginState) {
    state.isShowLoginView = loginState
  }
}
