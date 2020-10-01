import CompUser from "./CompUser"
import { Divider } from "antd"
import CompServerStatus from "./CompServers"
import React from "react"
import CompUserCount from "./CompClients"

const CompStatus = () => {
  console.log("rendered CompStatus")
  return (
    <div className="w-full py-2 px-4 inline-flex items-center justify-center text-gray-500">
      {/* 用户状态 */}
      <CompUser />

      <Divider type="vertical" />

      <CompUserCount />

      <Divider type="vertical" />

      {/* 服务器状态 */}
      <CompServerStatus />
    </div>
  )
}

export default CompStatus
