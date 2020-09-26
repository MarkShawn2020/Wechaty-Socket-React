import { UserStatusState } from "../../store/storeUserStatus"
import { UserStatus } from "../../interface"
import React from "react"
import { useCookies } from "react-cookie"
import { connect } from "react-redux"

export interface CompUserStatusProps {
  userStatus: UserStatus
}

const CompUserStatus = (props: CompUserStatusProps) => {
  const [cookie] = useCookies()
  return (
    <span className="inline-flex">
      {cookie.user ? cookie.user.username : "用户状态"} ：
      {(() => {
        switch (props.userStatus) {
          case UserStatus.UNKNOWN:
            return <p className="text-red-500">未连接</p>
          case UserStatus.LOGIN:
            return <p className="text-green-500">已登录</p>
          case UserStatus.LOGOUT:
            return <p className="text-red-500">已退出</p>
          default:
            return <p className="text-red-600">异常</p>
        }
      })()}
    </span>
  )
}

export default connect((userState: UserStatusState, ownProps) => {
  return {
    userStatus: userState.userStatus,
  }
})(CompUserStatus)
