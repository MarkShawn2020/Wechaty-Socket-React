import MyHeader from "./layout/header"
import Content from "./layout/content"
import MyFooter from "./layout/footer"
import React, { useEffect, useState } from "react"
import { Provider } from "react-redux"
import store from "./store/storeUserStatus"
import { useCookies } from "react-cookie"
import { ActionTypes } from "./store/ActionTypes"
import { UserStatus } from "./data-sctructure/enums"
import { ServerItem } from "./data-sctructure/interface"
import { API } from "./data-sctructure/API"
import { $http } from "./utils/$http"
import { Result } from "antd"

const App = () => {
  const [cookie] = useCookies()
  const [serverConnected, setServerConnected] = useState(false)

  const initCheck = async () => {
    $http.get(API.server.servers).then(({ data: servers }) => {
      if (servers.length > 0) {
        setServerConnected(true)
        if (!cookie.user) {
          store.dispatch({
            type: ActionTypes.updateUserStatus,
            payload: UserStatus.UNKNOWN,
          })
        } else if (
          servers.filter(
            (server: ServerItem) => server.username === cookie.username
          ).length > 0
        ) {
          store.dispatch({
            type: ActionTypes.updateUserStatus,
            payload: UserStatus.LOGIN,
          })
        } else {
          store.dispatch({
            type: ActionTypes.updateUserStatus,
            payload: UserStatus.LOGOUT,
          })
        }
      }
    })
  }

  useEffect(() => {
    initCheck().catch((err) => {
      console.log({ err })
    })
  }, [])

  if (serverConnected) {
    return (
      <Provider store={store}>
        <MyHeader appName={process.env.REACT_APP_NAME || "小成时光屋"} />
        <Content />
        <MyFooter />
      </Provider>
    )
  }
  return (
    // <></>
    <Result
      status="error"
      title="哎呀，后台好像还没启动……"
      className="text-center h-screen"
    >
      <div>要不试试给站长（南川）发邮件？</div>
      <br />
      <div>
        <a href="mailto:877210964@qq.com" className="text-pink-500">
          {" "}
          点击发送{" "}
        </a>
      </div>
    </Result>
  )
}

export default App
