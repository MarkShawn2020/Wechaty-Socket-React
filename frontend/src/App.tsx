import React from "react"
import { Layout } from "antd"
import CompFooter from "./components/CompFooter/CompFooter"
import CompHeader from "./components/CompHeader/header"
import CompContent1 from "./components/CompContent1/CompContent1"
import CompContent2 from "./components/CompContent2/CompContent2"
import CompInvisible from "./components/CompInvisible/CompInvisible"

const App = () => {
  console.log("rendered APP")

  return (
    <Layout className="relative min-h-screen min-w-screen">
      <Layout.Header className="flex items-center bg-pink-200 p-4">
        <CompHeader />
      </Layout.Header>

      <Layout.Content className="w-full xl:w-4/5 mx-auto flex flex-wrap">
        {/* 最重要的主区域 */}
        <div className="order-1 flex-1 w-full md:w-3/5">
          <CompContent1 />
        </div>

        {/* 次重要的右区域 */}
        <div className="order-2 w-full md:w-2/5">
          <CompContent2 />
        </div>
      </Layout.Content>

      <Layout.Footer className=" w-full">
        <CompFooter />
      </Layout.Footer>

      <CompInvisible />
    </Layout>
  )
}

export default App
