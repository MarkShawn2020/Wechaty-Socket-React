import { createStore } from "redux"
import { ActionTypes } from "./ActionTypes"
import { UserStatus } from "../interface"

export interface Action {
  type: ActionTypes // 一般项目都会用字符串，比如`ADD_COUNT`，我更喜欢enum，所以用数字
  payload: any // TODO： 有待细化
}

export interface UserStatusState {
  userStatus: UserStatus
}

export const DEFAULT_STATE: UserStatusState = {
  userStatus: UserStatus.UNKNOWN,
}

export const reducer = (
  state: UserStatusState = DEFAULT_STATE,
  action: Action
) => {
  switch (action.type) {
    case ActionTypes.updateUserStatusLogined:
      return {
        userStatus: UserStatus.LOGIN,
      }
    case ActionTypes.updateUserStatus:
      return {
        userStatus: action.payload,
      }
    case ActionTypes.resetUserStatus:
      return { ...DEFAULT_STATE }
    default:
      return { ...DEFAULT_STATE }
  }
}

const store = createStore(reducer)
export default store
