import {
  Actions,
  CoreStatus,
  PayloadUser,
  ServerItem,
} from "../../../DS/interface"
import { Button, message } from "antd"
import React, { Dispatch, useRef, useState } from "react"
import { ServerStatus } from "../../../DS/enums"
import { connect } from "react-redux"
import { State } from "../../../store"
import { EventSocket } from "../../../DS/actions"
import MyIcon, { IconType } from "../../../utils/icons"
import { Code } from "../../../DS/codes"

export interface CompRequestServerProps {
  server: ServerItem
}

export interface CompRequestServerStates {
  user: PayloadUser
  status: CoreStatus
}

export interface CompServerDispatch {
  requestServer: (user: PayloadUser, server: ServerItem) => void
  releaseServer: () => void
  replaceServer: () => void // todo: replaceServer
}

const CompRequestServer = (
  props: CompRequestServerStates & CompRequestServerProps & CompServerDispatch
) => {
  const [isLoading, setLoading] = useState(false)
  const lastServerStatus = useRef(props.server.status)
  if (props.server.status !== lastServerStatus.current) {
    lastServerStatus.current = props.server.status
    setLoading(false)
  }

  const rejectLogin = () => {
    if (!props.user.hasLogined) {
      return message.error({ content: "该功能需要登录才可以使用！" })
    }
  }

  const onRequestServer = () => {
    if (!rejectLogin()) {
      setLoading(true)
      props.requestServer(props.user, props.server)
    }
  }

  const onReleaseServer = () => {
    if (!rejectLogin()) props.releaseServer()
  }

  const onReplaceServer = () => {
    message.error({
      content: "后续开发中，敬请期待！^_^",
    })
    // if (!rejectLogin()) props.replaceServer()
  }

  if (props.server.status === ServerStatus.IDLE) {
    return (
      <Button type={"primary"} onClick={onRequestServer} loading={isLoading}>
        申请
      </Button>
    )
  }

  if (props.server.username === props.user.username) {
    return (
      <Button type="primary" danger onClick={onReleaseServer}>
        下线
      </Button>
    )
  }

  return (
    <Button
      type="primary"
      danger
      onClick={onReplaceServer}
      className="inline-flex items-center"
    >
      <MyIcon type={IconType.WARNING} className="text-xs" /> 踢线
    </Button>
  )
}

export default connect(
  (state: State): CompRequestServerStates => ({
    user: state.user,
    status: state.status,
  }),
  (dispatch: Dispatch<Actions>): CompServerDispatch => ({
    requestServer: (user, server) =>
      dispatch({
        type: EventSocket.CLIENT_REQUEST_SERVER,
        payload: { user, server },
        callback: (code) => {
          if (code === Code.SUCCESS) {
            message.success({ content: "服务器启动成功！" })
          }
        },
      }),
    releaseServer: () =>
      dispatch({
        type: EventSocket.CLIENT_RELEASE_SERVER,
      }),
    replaceServer: () =>
      dispatch({
        type: EventSocket.CLIENT_REPLACE_SERVER,
      }),
  })
)(CompRequestServer)
