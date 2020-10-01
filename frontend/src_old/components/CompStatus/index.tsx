import { ServerItem } from "../../data-sctructure/interface"
import CompUserStatus from "./CompUserStatus"
import { Divider } from "antd"
import CompServerStatus from "./CompServerStatus"
import React from "react"

const CompRowStatus = (props: { servers: ServerItem[]; users: number }) => {
  return (
    <div className="inline-flex items-center text-gray-500">
      {/* 用户状态 */}
      <CompUserStatus />

      <Divider type="vertical" />

      <span>在线人数：{props.users}</span>

      <Divider type="vertical" />

      {/* 服务器状态 */}
      <CompServerStatus servers={props.servers} />
    </div>
  )
}

export default CompRowStatus
