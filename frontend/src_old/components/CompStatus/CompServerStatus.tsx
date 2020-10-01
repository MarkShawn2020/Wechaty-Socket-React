import MyIcon, { IconType } from "../CompIcon"
import { Space, Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"
import React from "react"
import { ServerItem } from "../../data-sctructure/interface"

const CompServerStatus = (props: { servers: ServerItem[] }) => {
  return (
    <span className="inline-flex">
      服务器状态：
      {props.servers.length > 0 ? (
        <span className="text-green-500 flex items-center">
          ONLINE <MyIcon type={IconType.DOT_CONNECTED} className="text-xl" />
        </span>
      ) : (
        <Space size="large">
          <span className="text-red-500">CONNECTING</span>
          <Spin indicator={<LoadingOutlined className="text-red-500" spin />} />
        </Space>
      )}
    </span>
  )
}

export default CompServerStatus
