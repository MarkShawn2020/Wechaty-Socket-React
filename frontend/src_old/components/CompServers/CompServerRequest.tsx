import { ServerItem } from "../../data-sctructure/interface"
import { UserStatus } from "../../data-sctructure/enums"
import { useCookies } from "react-cookie"
import { Button, message } from "antd"
import React from "react"
import store from "../../store/storeUserStatus"

const CompServerRequest = (props: {
  server: ServerItem
  onRequestServer: any
  onRequestServerLogoutSelf: any
  onRequestServerLogoutOther: any
}) => {
  const [cookie] = useCookies()
  const onRequestServer = () => {
    if (store.getState().userStatus !== UserStatus.LOGIN) {
      return message.error({ content: "该功能需要登录才可以使用！" })
    }
    return props.onRequestServer(props.server)
  }

  if (props.server.isIdle) {
    return (
      <Button type="primary" onClick={onRequestServer}>
        申请
      </Button>
    )
  }
  if (props.server.username === cookie.username) {
    return (
      <Button type="primary" danger onClick={props.onRequestServerLogoutSelf}>
        下线
      </Button>
    )
  }
  return (
    <Button type="primary" danger onClick={props.onRequestServerLogoutOther}>
      踢线
    </Button>
  )
}

export default CompServerRequest
