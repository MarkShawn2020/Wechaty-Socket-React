import React from "react"
import ReactDom from "react-dom"
import { ConfigProvider, Layout } from "antd"

// import App from "./App"
import App2 from "./App2"

import "antd/dist/antd.css"
import "./styles/output.css"
import "./styles/custom-antd.css"
import { Provider } from "react-redux"
import socketSore from "./store/socketStore"

ReactDom.render(
  <React.Fragment>
    <div className=" min-h-screen min-w-full">
      {/* 配置主视图为宽度一半居中 */}
      <div className="w-full lg:w-3/5 mx-auto">
        {/* 配置AntD的全局组件默认尺寸为小 */}
        <ConfigProvider componentSize="small">
          <Layout className="relative">
            <Provider store={socketSore}>
              <App2 />
            </Provider>
          </Layout>
        </ConfigProvider>
      </div>
    </div>
  </React.Fragment>,

  document.getElementById("root")
)
