import { Avatar, Button, Card, Empty, Layout, notification, Space } from "antd"
import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import { useCookies } from "react-cookie"

import ScanModal from "./ScanModal"
import { LoginStatus, ScanMsg, UserData } from "../interface"

/**
 * 页面加载时即开启socket连接，对应的服务器后台将自动开启一个wechaty机器人
 * 这样可以显著提升后续与二维码的交互体验
 */
const socket = io("ws://localhost:" + process.env.REACT_APP_SOCKET_PORT)
console.log("initialized one socket")

interface UserCookie {
  userData: UserData
  loginStatus: LoginStatus
}

const MyContent = (props: any) => {
  /**
   * 首先应该从浏览器的cookies中查找是否有用户信息
   */
  const [userData, setUserData] = useState<UserData>({} as any)
  const [scanMsg, setScanMsg] = useState<ScanMsg>({} as any)
  const [cookies, setCookie, rmCookie] = useCookies({} as any)
  const [scanModalVisible, setScanModalVisible] = useState(false)
  const [msgHistory, setMsgHistory] = useState<string[]>([])

  /**
   * 初始化socket的一些方法绑定
   * 扫码会影响scanMsg，并打开scanModal
   * 登录会影响userData，并关闭scanModal
   */
  useEffect(() => {
    socket
      .on("scan", onScan)
      .on("loginSuccess", onLoginSuccess)
      .on("message", onMessage)
  }, [])

  /**
   * 初始加载cookie
   */
  useEffect(() => {
    if (cookies.userData) {
      setUserData(cookies.userData)
    }
  }, [cookies.userData])

  /**
   * 存储cookie
   */
  useEffect(() => {
    if (userData.name) {
      console.log("存储cookie")
      setCookie("userData", userData)
    }
  }, [userData, setCookie])

  /**
   * 监控服务器返回的信息
   */
  const onScan = (scan: ScanMsg) => {
    /**
     * 只要返回就应该弹窗，因为已经与关窗的逻辑解耦了
     * 主要是若退出账号后重新登录，服务器的二维码并没有刷新，依旧保留在已确认状态
     * 更新：由于后端做了刷新处理，此处依旧可以做些强条件处理
     */
    // console.log(`更新scan, status: ${scan.status}, qrCode: ${scan.qrCode}`)
    setScanMsg(scan)
  }

  const onMessage = (msg: object) => {
    // console.log(msg)
    // @ts-ignore
    const msgHistoryNew = [JSON.stringify(msg.payload, null, 2), ...msgHistory]
    console.log(msgHistoryNew)
    setMsgHistory(msgHistoryNew)
  }

  const onLoginSuccess = (user: UserData) => {
    console.log("关闭扫码弹窗")
    setScanModalVisible(false)

    console.log("更新用户数据")
    setUserData(user)

    console.log("显示登录通知")
    notification.success({
      message: "登录成功！",
      description: `欢迎${user.name}走进${process.env.REACT_APP_NAME}`,
      duration: 2,
    })
  }

  /**
   * 监控用户点击登录与退出按钮的动作，这里的机制是页面启动即开启ws，而非点击登录时
   * 否则将造成用户等待扫码出现的时间过长影响体验
   */
  const onClickLogin = () => {
    console.log("向服务器发送登录请求")
    socket.emit("scan")

    console.log("打开弹窗")
    setScanModalVisible(true)
  }

  const onClickLogout = async () => {
    console.log("请求服务器退出")
    socket.emit("logout")

    console.log("清空用户数据")
    setUserData({} as any)

    console.log("清除cookie中的userData")
    rmCookie("userData")

    console.log("显示退出通知")
    notification.success({
      message: "退出成功！",
      description: `等候${userData.name}再次光临${process.env.REACT_APP_NAME}哦！`,
      duration: 2,
    })
  }

  console.log({
    status: scanMsg.status,
    name: userData.name,
  })
  return (
    <Layout.Content className="w-full">
      {/* 扫码弹窗 */}
      <ScanModal msg={scanMsg} visible={scanModalVisible} />

      <Card title="登录状态">
        <div className="flex items-center justify-between">
          <Space>
            <Avatar src={userData.avatar} size={"large"} />

            <p>{userData?.name}</p>

            <p
              className={`text-${
                userData.name ? "green" : "red"
              }-600 text-center`}
            >
              {userData.name ? "在线" : "离线"}
            </p>
          </Space>

          {userData.name ? (
            <Button type={"primary"} danger onClick={onClickLogout}>
              退出
            </Button>
          ) : (
            <Button type={"primary"} onClick={onClickLogin}>
              登录
            </Button>
          )}
        </div>
      </Card>

      <Card title={"历史消息"}>
        {msgHistory.length === 0 ? (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <pre>
            {msgHistory.map((s) => (
              <p key={JSON.parse(s).id}>{s}</p>
            ))}
          </pre>
        )}
      </Card>

      <Card title="历史撤回" className="w-full">
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>

      <Card title={"基本信息"}>
        {userData ? (
          <pre>{JSON.stringify(userData, null, 4)}</pre>
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </Card>
    </Layout.Content>
  )
}

export default MyContent
