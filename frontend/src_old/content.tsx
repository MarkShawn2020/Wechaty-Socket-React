import { Card, Empty, Layout, message } from "antd"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Message } from "wechaty"
import { useCookies } from "react-cookie"

import {
  ContactItem,
  ScanDataType,
  ServerItem,
  WechatAccountItem,
} from "../src/data-sctructure/interface"
import { ScanStatus, UserStatus } from "../src/data-sctructure/enums"
import { API } from "../src/data-sctructure/API"
import { Code } from "../src/data-sctructure/codes"
import CompScan from "../src/components/CompLogin/CompScan"
import MemoServers from "../src/components/CompServers/CompServerList"
import MemoMessages from "../src/components/CompMessages/CompMessages"
import CompWechatBasic from "../src/components/CompBasicInfo/CompWechatBasic"
import { $http } from "../src/utils/$http"
import store from "../store/storeUserStatus"
import { ActionTypes } from "../store/ActionTypes"
import { CompSocket } from "../src/components/CompSocket/CompSocket"
import { EventFromClient } from "../src/data-sctructure/events"
import MemoContactList from "../src/components/CompContacts/CompContactList"

const Content = () => {
  /**
   * 首先应该从浏览器的cookies中查找是否有用户信息
   */
  const [userData, setUserData] = useState<WechatAccountItem>({} as any)
  const [scanData, setScanData] = useState<ScanDataType>()

  const [cookie, setCookie] = useCookies(null as any)
  const [scanVisible, setScanVisible] = useState(false)
  const [msgHistory, setMsgHistory] = useState<Message[]>([])
  const [servers, setServers] = useState<ServerItem[]>([])
  const [clientsCount, setClientsCount] = useState<number>(0)
  const [contacts, setContacts] = useState<ContactItem[]>([])
  const [wechatBasic, setWechatBasic] = useState<WechatAccountItem>({} as any)
  console.log("--- rendered content ---")
  // /**
  //  * 检查服务器连接状态
  //  */
  // useEffect(() => {
  //   fetchServers().then()
  // }, [serverArray.length, serverArray.filter((server) => server.isIdle).length])

  /**
   * on
   */
  const onBotScan = async (scan: ScanDataType) => {
    /**
     * 只要返回就应该弹窗，因为已经与关窗的逻辑解耦了
     * 主要是若退出账号后重新登录，服务器的二维码并没有刷新，依旧保留在已确认状态
     * 更新：由于后端做了刷新处理，此处依旧可以做些强条件处理
     */
    console.log(scan)
    setScanData(scan)
    if (scan.qrcode && scan.status === ScanStatus.Waiting) {
      setScanVisible(true)
    }
  }

  const onBotLogin = async (user: WechatAccountItem) => {
    console.log("登录成功，关闭扫码弹窗")
    await setScanVisible(false)

    // console.log("更新服务器状态")
    // await fetchServers()

    console.log("更新本地cookie")
    setCookie("wxid", user.id)

    console.log("更新用户状态")
    await store.dispatch({
      type: ActionTypes.updateUserStatus,
      payload: UserStatus.LOGIN,
    })

    console.log("更新用户数据", user)
    await setUserData(user)
  }

  const onBotMessage = (msg: Message) => {
    console.log(msg)
    setMsgHistory((msgHistory) => [msg, ...msgHistory])
  }

  const onServersNow = (servers: ServerItem[]) => {
    setServers(servers)
  }

  const onClientsNow = (users: number) => {
    setClientsCount(users)
  }
  /**
   * fetch
   */
  // const fetchServers = async () => {
  //   const { data: serverArray } = await $http.get(API.server.serverArray)
  //   setServers(serverArray)
  // }

  const fetchContacts = async (skip = 0, limit = 100) => {
    console.log("fetching contacts ...")
    const { data } = await $http.get(API.wechat.contacts, {
      params: { username: cookie.username, skip, limit },
    })
    await setContacts((contacts) => [...contacts, ...data])
    await console.log({ skip, limit, contactLength: (() => contacts.length)() })
    if (data.length === limit) {
      await fetchContacts(skip + limit)
    }
  }

  /**
   * emit
   */

  const emitServerRequest = async (server: ServerItem) => {
    console.log(`${cookie.username}正在申请启动机器人……`)

    return socketRef.current.emitEvent(
      EventFromClient.ClientRequestServer,
      server,
      (status: Code) => {
        if (status === Code.SUCCESS) {
          message.success({ content: "微信机器人后台登录成功" })
        } else {
          message.error({ content: Code[status] })
        }
      }
    )
  }

  const emitServerDaemon = async () => {
    await socketRef.current.emitEvent(EventFromClient.ClientControlServerDaemon)
    // await fetchServers()
  }

  const emitServerDaemonCancel = async () => {
    await socketRef.current.emitEvent(
      EventFromClient.ClientControlServerDaemonCancel
    )
  }

  const emitServerRequestLogoutSelf = async () => {
    await socketRef.current.emitEvent(
      EventFromClient.ClientRequestServerLogoutSelf
    )
  }

  const emitServerRequestLogoutOther = async () => {
    await socketRef.current.emitEvent(
      EventFromClient.ClientRequestServerLogoutOther
    )
  }

  const socketRef = useRef<CompSocket>(
    new CompSocket(
      {
        onBotLogin,
        onBotScan,
        onBotMessage,
        onServersNow,
        onClientsNow,
      },
      {
        emitServerDaemon,
        emitServerDaemonCancel,
        emitServerRequest,
        emitServerRequestLogoutSelf,
        emitServerRequestLogoutOther,
      },
      {
        fetchContacts,
        // fetchServers,
      }
    )
  )

  // 一打开网页就启动socket
  if (!socketRef.current.isSocketInitialized) {
    socketRef.current.initWechaty(cookie.username)
  }

  return (
    <Layout.Content className="w-full">
      {/* 服务器列表，依赖：服务器数量、服务器状态量 */}
      <MemoServers
        servers={servers}
        users={clientsCount}
        onRequestServer={emitServerRequest}
        onRequestServerLogoutSelf={emitServerRequestLogoutSelf}
        onRequestServerLogoutOther={emitServerRequestLogoutOther}
      />

      {/* 扫码弹窗 */}
      {scanData && <CompScan msg={scanData} visible={scanVisible} />}

      {/* 实时消息，依赖：消息总数 */}
      <MemoMessages
        msgHistory={useMemo(() => msgHistory, [msgHistory.length])}
      />

      <CompWechatBasic />

      {/* 好友列表，依赖：好友数目 */}
      <MemoContactList />

      <Card title="历史撤回" className="w-full">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    </Layout.Content>
  )
}

export default Content
