import React from "react"
import ReactDom from "react-dom"
import "antd/dist/antd.css"
import "./styles/output.css"
import { Layout } from "antd"
import MyHeader from "./components/header"
import MyFooter from "./components/footer"
import MyContent from "./components/content"

ReactDom.render(
  <React.Fragment>
    <div className="h-screen w-screen">
      <div className="w-full lg:w-1/2 mx-auto">
        <Layout className="relative">
          <MyHeader appName={process.env.REACT_APP_NAME} />
          <MyContent />

          <MyFooter />
        </Layout>
      </div>
    </div>
  </React.Fragment>,

  document.getElementById("root")
)
