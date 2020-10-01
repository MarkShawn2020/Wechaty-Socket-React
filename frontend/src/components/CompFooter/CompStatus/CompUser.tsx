import React from "react"
import { State } from "../../../store"
import { PayloadUser } from "../../../DS/interface"
import { connect } from "react-redux"

export interface CompUserStates {
  user: PayloadUser
}

const CompUser = (props: CompUserStates) => {
  return (
    <span className="inline-flex">
      {props.user.username || "用户状态"} ：
      {(() => {
        if (!props.user.hasLogined) {
          return <p className="text-red-500">未登录</p>
        } else {
          return <p className="text-green-500">已登录</p>
        }
      })()}
    </span>
  )
}

export default connect(
  (state: State): CompUserStates => ({
    user: state.user,
  })
)(CompUser)
