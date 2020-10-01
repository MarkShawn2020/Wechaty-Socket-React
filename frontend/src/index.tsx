import React from "react"
import ReactDom from "react-dom"
import { ConfigProvider } from "antd"
import { Provider } from "react-redux"

import App from "./App"
import socketStore from "./store"

import "antd/dist/antd.css"
import "./styles/css/output.css"
import "./styles/css/custom-antd.css"
import "./styles/css/list.scss"
import "./styles/css/login.css"

ReactDom.render(
  <React.Fragment>
    {/* 配置store */}
    <Provider store={socketStore}>
      {/* 配置antD尺寸 */}
      <ConfigProvider componentSize="small">
        <App />
      </ConfigProvider>
    </Provider>
  </React.Fragment>,

  document.getElementById("root")
)
