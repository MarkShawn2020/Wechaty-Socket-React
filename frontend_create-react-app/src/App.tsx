import MyHeader from "./layout/header"
import Content from "./layout/content"
import MyFooter from "./layout/footer"
import React, { useEffect, useState } from "react"
import { Provider } from "react-redux"
import store from "./store/storeUserStatus"
import { useCookies } from "react-cookie"
import { ActionTypes } from "./store/ActionTypes"
import { ServerItem, UserStatus } from "./interface"
import { API } from "./interface/API"
import { $http } from "./utils/$http"

const App = () => {
  const [cookie] = useCookies()
  const [serverConnected, setServerConnected] = useState(false)

  const initCheck = async () => {
    const { data: servers }: { data: ServerItem[] } = await $http.get(
      API.server.list
    )
    if (servers.length > 0) {
      setServerConnected(true)
      if (!cookie.user) {
        store.dispatch({
          type: ActionTypes.updateUserStatus,
          payload: UserStatus.UNKNOWN,
        })
      } else if (
        servers.filter((server) => server.name === cookie.user.username)
          .length > 0
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
  }

  useEffect(() => {
    initCheck().then()
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
    <></>
    // <Result
    //   status="info"
    //   title="哎呀，后台好像还没启动……"
    //   className="text-center"
    // >
    //   <div>要不试试给站长（南川）发邮件？</div>
    //   <br />
    //   <div>
    //     <a href="mailto:877210964@qq.com" className="text-pink-500">
    //       {" "}
    //       点击发送{" "}
    //     </a>
    //   </div>
    // </Result>
  )
}

export default App
