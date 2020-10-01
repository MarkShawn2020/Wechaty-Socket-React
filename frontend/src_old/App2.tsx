import React from "react"
import { SocketState } from "./store/socketStore"
import { ServerItem } from "./data-sctructure/interface"
import { Contact, Message } from "wechaty"
import { connect } from "react-redux"

const App2 = (props: SocketState) => {
  return (
    <div>
      {/* 服务器状态信息 */}
      <p>服务器状态：{props.isServerConnected}</p>

      {/* 机器人列表 */}
      <ul>
        机器人列表：
        {props.serverArray.map((server: ServerItem) => {
          return `${server.username} - ${server.token}`
        })}
      </ul>

      {/* 客户端连接数目 */}
      <p>客户端数目：{props.clientCount}</p>

      {/* 扫码状态 */}
      <p>扫码状态：{props.wechatScan}</p>

      {/* 微信基本信息 */}
      <pre>微信基本信息：{JSON.stringify(props.wechatBasic, null, 2)}</pre>

      {/*  微信实时消息 */}
      <ul>
        微信实时消息：
        {props.wechatMessages.map((message: Message) => {
          return `${message.toString()}`
        })}
      </ul>

      {/*  微信好友列表 */}
      <ul>
        微信好友列表：
        {props.wechatContacts.map((contact: Contact) => {
          return `${contact.name()} - ${contact.gender()}`
        })}
      </ul>
    </div>
  )
}

const mapStateToProps = (state: SocketState) => {
  return {
    username: state.username,
    isServerConnected: state.isServerConnected,
    serverArray: state.serverArray,
    clientCount: state.clientCount,
    wechatScan: state.wechatScan,
    wechatBasic: state.wechatBasic,
    wechatMessages: state.wechatMessages,
    wechatContacts: state.wechatContacts,
  }
}

export default connect(mapStateToProps)(App2)
