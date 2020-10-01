import { ServerItem, PayloadUser, Actions } from "../../../DS/interface"
import { Button } from "antd"
import React, { Dispatch } from "react"
import { ServerStatus } from "../../../DS/enums"
import { connect } from "react-redux"
import { State } from "../../../store"
import { EventSocket } from "../../../DS/actions"

export interface CompServerDaemonProps {
  user: PayloadUser
  server: ServerItem
}

export interface CompDaemonServerDispatch {
  daemonServerDispatch: () => void
}

const CompDaemonServer = (
  props: CompServerDaemonProps & CompDaemonServerDispatch
) => {
  if (
    props.user.hasLogined &&
    props.server.status !== ServerStatus.IDLE &&
    props.server.username === props.user.username
  ) {
    if (props.server.status !== ServerStatus.DAEMON) {
      return (
        <Button type="primary" onClick={props.daemonServerDispatch}>
          托管
        </Button>
      )
    }
    return (
      <Button type="primary" danger onClick={props.daemonServerDispatch}>
        释放
      </Button>
    )
  } else {
    return <></>
  }
}

export default connect(
  (state: State, props: any): CompServerDaemonProps => {
    return {
      user: state.user,
      server: props.server,
    }
  },
  (dispatch: Dispatch<Actions>): CompDaemonServerDispatch => ({
    daemonServerDispatch: () =>
      dispatch({
        type: EventSocket.CLIENT_DAEMON_SERVER_OR_NOT,
      }),
  })
)(CompDaemonServer)
